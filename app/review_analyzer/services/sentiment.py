"""Sentiment analysis service using Hugging Face transformers."""
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import os

# Model name from environment or default
MODEL_NAME = os.getenv('HF_SENTIMENT_MODEL', 'cardiffnlp/twitter-roberta-base-sentiment')

# Load model and tokenizer once at module import (singleton pattern)
print(f"Loading sentiment analysis model: {MODEL_NAME}...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
print("Sentiment analysis model loaded successfully!")

# Label mapping for the model
# cardiffnlp/twitter-roberta-base-sentiment outputs: 0=negative, 1=neutral, 2=positive
LABEL_MAPPING = {
    0: 'negative',
    1: 'neutral',
    2: 'positive'
}


def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of the given text.
    
    Args:
        text: The text to analyze
        
    Returns:
        dict with keys:
            - sentiment: str ('positive', 'neutral', or 'negative')
            - score: float (confidence score 0-1)
    """
    try:
        # Tokenize input
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        
        # Get model predictions
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
        
        # Get probabilities using softmax
        probabilities = torch.nn.functional.softmax(logits, dim=-1)
        
        # Get predicted class and confidence
        predicted_class = torch.argmax(probabilities, dim=-1).item()
        confidence = probabilities[0][predicted_class].item()
        
        # Map to sentiment label
        sentiment = LABEL_MAPPING.get(predicted_class, 'neutral')
        
        return {
            'sentiment': sentiment,
            'score': confidence
        }
    
    except Exception as e:
        print(f"Error in sentiment analysis: {e}")
        # Return neutral sentiment with low confidence on error
        return {
            'sentiment': 'neutral',
            'score': 0.5
        }


if __name__ == '__main__':
    # Test the sentiment analyzer
    test_texts = [
        "This product is amazing! I love it so much!",
        "It's okay, nothing special.",
        "Terrible quality, very disappointed."
    ]
    
    for text in test_texts:
        result = analyze_sentiment(text)
        print(f"\nText: {text}")
        print(f"Sentiment: {result['sentiment']} (confidence: {result['score']:.4f})")
