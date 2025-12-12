"""Key points extraction service using Google Gemini AI."""
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not GEMINI_API_KEY or GEMINI_API_KEY == 'your_gemini_api_key_here':
    print("WARNING: GEMINI_API_KEY not set or using placeholder value!")
    print("Please set your Gemini API key in the .env file")
    GEMINI_CONFIGURED = False
else:
    genai.configure(api_key=GEMINI_API_KEY)
    GEMINI_CONFIGURED = True
    print("Gemini API configured successfully!")

# Initialize the model
model = genai.GenerativeModel('gemini-2.0-flash-exp') if GEMINI_CONFIGURED else None


def extract_key_points(text: str) -> list[str]:
    """
    Extract key points from a product review using Gemini AI.
    
    Args:
        text: The review text to analyze
        
    Returns:
        list of strings (max 5 key points), or empty list on error
    """
    if not GEMINI_CONFIGURED or not model:
        print("Gemini API not configured, returning empty key points")
        return []
    
    try:
        # Create a deterministic prompt for consistent output
        prompt = f"""Analyze the following product review and extract the main key points.

Review: "{text}"

Instructions:
- Extract 3-5 most important points from the review
- Each point should be a concise sentence (max 15 words)
- Focus on specific aspects mentioned (quality, price, features, service, etc.)
- Be objective and factual
- Return ONLY the key points, one per line
- Do NOT include numbering, bullets, or any other formatting
- Do NOT add any introduction or conclusion

Key points:"""

        # Generate response
        response = model.generate_content(prompt)
        
        if not response or not response.text:
            return []
        
        # Parse response - split by newlines and clean up
        lines = response.text.strip().split('\n')
        key_points = []
        
        for line in lines:
            # Clean up the line
            line = line.strip()
            
            # Skip empty lines
            if not line:
                continue
            
            # Remove common prefixes (numbers, bullets, dashes)
            line = line.lstrip('0123456789.-•*) ')
            
            # Add to key points if not empty and not too long
            if line and len(line) > 5:
                key_points.append(line)
            
            # Limit to 5 key points
            if len(key_points) >= 5:
                break
        
        return key_points
    
    except Exception as e:
        print(f"Error extracting key points with Gemini: {e}")
        # Return empty list on error (don't crash the request)
        return []


if __name__ == '__main__':
    # Test the key points extractor
    test_review = """This laptop is absolutely fantastic! The build quality is excellent with a 
    premium aluminum chassis. The battery life easily lasts 10+ hours of normal use. The display 
    is bright and vibrant with accurate colors. Performance is snappy for everyday tasks. 
    However, it does get a bit warm during heavy workloads. The price is a bit high but worth 
    it for the quality. Customer service was very responsive when I had questions."""
    
    print("Testing Gemini key points extraction...")
    print(f"\nReview: {test_review}\n")
    
    key_points = extract_key_points(test_review)
    
    if key_points:
        print("Key Points:")
        for i, point in enumerate(key_points, 1):
            print(f"{i}. {point}")
    else:
        print("No key points extracted (API may not be configured)")
