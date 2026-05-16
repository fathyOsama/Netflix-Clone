CREATE DATABASE pulsescreen_video_db;
USE pulsescreen_video_db;


CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    full_name VARCHAR(255) NOT NULL,

    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    active BOOLEAN NOT NULL DEFAULT FALSE,

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    verification_token VARCHAR(255) UNIQUE,

    verification_token_expiry TIMESTAMP NULL,

    password_reset_token VARCHAR(255),

    password_reset_token_expiry TIMESTAMP NULL,

    create_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    update_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================
-- TABLE: videos
-- ======================================
CREATE TABLE videos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    year INT,

    rating VARCHAR(50),

    duration INT,

    src VARCHAR(255),

    poster VARCHAR(255),

    published BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- ======================================
-- TABLE: video_categories
-- ======================================
CREATE TABLE video_categories (
    video_id BIGINT NOT NULL,

    category VARCHAR(255) NOT NULL,

    CONSTRAINT fk_video_categories_video
        FOREIGN KEY (video_id)
        REFERENCES videos(id)
        ON DELETE CASCADE
);


CREATE TABLE user_watchlist (
    user_id BIGINT NOT NULL,

    video_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, video_id),

    CONSTRAINT fk_watchlist_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_watchlist_video
        FOREIGN KEY (video_id)
        REFERENCES videos(id)
        ON DELETE CASCADE
);