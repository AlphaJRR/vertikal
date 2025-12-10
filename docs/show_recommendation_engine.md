# VERTIKAL — Show Recommendation Engine (Phase 1)

## Method

Match related shows using:
- Tag overlap score
- Creator similarity
- Popularity ranking

---

# PSEUDO:

relatedShows = allShows
  .filter(show => show.id !== current.id)
  .map(show => ({
     show,
     score: overlap(show.tags, current.tags)
  }))
  .sort(by score desc)
  .slice(0, 6)

