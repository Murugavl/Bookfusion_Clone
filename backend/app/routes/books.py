from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from app.models.db import mongo
from app.services.supabase_service import upload_file_to_supabase

books_bp = Blueprint("books", __name__)

# Maximum file size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024

def serialize_book(book, use_id_field=False):
    """Helper function to serialize book document"""
    book_dict = {
        "title": book.get("title", ""),
        "file_url": book.get("file_url", "")
    }
    if use_id_field:
        book_dict["id"] = str(book["_id"])
    else:
        book_dict["_id"] = str(book["_id"])
    return book_dict

@books_bp.route("/", methods=["GET"])
def get_books():
    """Get all books - returns with 'id' field"""
    try:
        books = mongo.db.books.find()
        output = [serialize_book(b, use_id_field=True) for b in books]
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch books", "details": str(e)}), 500

@books_bp.route("/all", methods=["GET"])
def get_all_books():
    """Get all books - returns with '_id' field (for backward compatibility)"""
    try:
        books = mongo.db.books.find()
        output = [serialize_book(b, use_id_field=False) for b in books]
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch books", "details": str(e)}), 500

@books_bp.route("/<book_id>", methods=["GET"])
def get_book_by_id(book_id):
    """Get a single book by ID"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        book = mongo.db.books.find_one({"_id": ObjectId(book_id)})
        
        if not book:
            return jsonify({"error": "Book not found"}), 404
        
        return jsonify(serialize_book(book, use_id_field=False)), 200
    except InvalidId:
        return jsonify({"error": "Invalid book ID format"}), 400
    except Exception as e:
        return jsonify({"error": "Failed to fetch book", "details": str(e)}), 500

@books_bp.route("/upload", methods=["POST"])
def upload_book():
    """Upload a new book"""
    try:
        # Validate title
        title = request.form.get("title", "").strip()
        if not title:
            return jsonify({"error": "Title is required"}), 400
        
        # Validate file
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided"}), 400
        
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        # Validate file size
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({
                "error": f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / (1024 * 1024)}MB"
            }), 400
        
        if file_size == 0:
            return jsonify({"error": "File is empty"}), 400
        
        # Upload file to Supabase
        try:
            file_url = upload_file_to_supabase(file)
        except Exception as e:
            return jsonify({
                "error": "Failed to upload file to storage",
                "details": str(e)
            }), 500
        
        # Save book to database
        try:
            result = mongo.db.books.insert_one({
                "title": title,
                "file_url": file_url
            })
            
            return jsonify({
                "message": "Book uploaded successfully",
                "file_url": file_url,
                "id": str(result.inserted_id)
            }), 201
        except Exception as e:
            return jsonify({
                "error": "Failed to save book to database",
                "details": str(e)
            }), 500
            
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e)
        }), 500

@books_bp.route("/<book_id>", methods=["DELETE"])
def delete_book(book_id):
    """Delete a book by ID"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        result = mongo.db.books.delete_one({"_id": ObjectId(book_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Book not found"}), 404
        
        return jsonify({"message": "Book deleted successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid book ID format"}), 400
    except Exception as e:
        return jsonify({"error": "Failed to delete book", "details": str(e)}), 500


