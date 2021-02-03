INSERT INTO users (name, email, password)
VALUES ('Willy Wonka', 'oompaloomps2@choco.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.' ),
('Tina Turner', 'tinasturning@leftturn.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Kermit The Frog', 'misspiggy@love4life.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_batherooms, number_of_bedrooms, country, street, city, province, post_code)

VALUES (1, 'chocolate factory', 'url.com', 'url.com', 12, 100, 4, 5, 'England', '123 Street', 'Birmingham', 'GB', '1A2B6C'),

(2, 'house', 'url.com', 'url.com', 1992, 3, 5, 7, 'New york', '143 AVE', 'Compton', 'NewYork', '1BCB45'),

(3, 'casket', 'url.com', 'url.com', 0, 0, 0, 0, 'Anywhere', 'Your Street', 'Your City', 'Your Province', 'Your postal code');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2020-01-01', '2020-02-02', 1, 3),
('2020-03-21', '2020-04-01', 2, 1),
('2021-01-01', '2021-02-02', 3, 2);

INSERT INTO property_reviews (guest_id,property_id, reservation_id, rating, message)
VALUES  (3,1,1,4, 'messages'),
(2,2,2,5, 'messages'),
(2,3,3,3, 'message');