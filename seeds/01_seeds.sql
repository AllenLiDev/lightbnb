INSERT INTO users (name, email, PASSWORD)
  VALUES ('john', 'legend@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('bob', 'robert@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('karl', 'hank@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
  VALUES (1, 'myhaws', 'johncena', '123', '123', 0, 0, 0, 0, 'can', '123st', '123city', '123prov', '123asd', TRUE), (2, 'myhaws', 'johncena', '123', '123', 0, 0, 0, 0, 'can', '123st', '123city', '123prov', '123asd', TRUE), (3, 'myhaws', 'johncena', '123', '123', 0, 0, 0, 0, 'can', '123st', '123city', '123prov', '123asd', TRUE);

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
  VALUES (1, 1, '2018-09-11', '2018-09-26'), (2, 2, '2019-01-04', '2019-02-01'), (3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
  VALUES (1, 1, 1, 7, 'ok'), (2, 2, 2, 6, 'meh'), (3, 3, 3, 8, 'good');
