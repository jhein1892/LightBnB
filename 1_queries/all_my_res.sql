SELECT reservations.*, properties.*, avg(property_reviews.rating)
FROM reservations
JOIN users ON guest_id=users.id
JOIN properties ON property_id=properties.id
JOIN property_reviews ON reservations.id=reservation_id
WHERE users.id = '1'
AND end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY start_date; 
LIMIT 10; 