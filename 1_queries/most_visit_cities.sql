SELECT properties.city, COUNT(reservations.property_id) as total_reservations
FROM properties
JOIN reservations on (properties.id = property_id)
GROUP BY properties.city
ORDER BY total_reservations desc; 