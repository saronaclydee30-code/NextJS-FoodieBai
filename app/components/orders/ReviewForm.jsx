"use client";

import { useState } from "react";
import AppIcon from "../shared/AppIcon";

const REVIEW_TAGS = ["Food quality", "Delivery speed", "Packaging", "Rider behavior"];

export default function ReviewForm({ onSubmit, compact = false }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);

  const toggleTag = (tag) => {
    setTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment, tags });
  };

  return (
    <form className={`review-form${compact ? " review-form-compact" : ""}`} onSubmit={handleSubmit}>
      <div className="review-form-heading">
        <div>
          <span className="section-eyebrow">HOW WAS IT?</span>
          <h3>Rate your order</h3>
        </div>
        <div className="review-star-picker" aria-label="Choose a rating from 1 to 5 stars">
          {Array.from({ length: 5 }, (_, index) => {
            const star = index + 1;
            return (
              <button key={star} type="button" className={star <= rating ? "selected" : ""} onClick={() => setRating(star)} aria-label={`${star} star${star === 1 ? "" : "s"}`} aria-pressed={star <= rating}>
                <AppIcon name="star" size={22} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="review-tag-picker" aria-label="Review tags">
        {REVIEW_TAGS.map((tag) => (
          <button key={tag} type="button" className={tags.includes(tag) ? "selected" : ""} onClick={() => toggleTag(tag)} aria-pressed={tags.includes(tag)}>{tag}</button>
        ))}
      </div>
      <label className="review-comment-field">
        <span>Your feedback <small>Optional</small></span>
        <textarea value={comment} maxLength={280} onChange={(event) => setComment(event.target.value)} placeholder="Tell other FoodieBai customers what you liked..." rows={3} />
      </label>
      <div className="review-form-footer">
        <small>{rating ? `${rating}/5 selected` : "Select a star rating to submit"}</small>
        <button className="primary-button" type="submit" disabled={!rating}>Submit review <AppIcon name="check" size={16} /></button>
      </div>
    </form>
  );
}
