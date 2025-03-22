# My E-Commerce Site

Attention! The site is still under construction (I am writing this on March 14, 2025). It does not have all the features presented yet. For example, many category pages have not yet been created or are empty. Many changes will be added from now on. My role in this project was to create a website from scratch by myself, which would include all the possible functionalities for a large-scale e-commerce website. There is still much to add. 

## Screenshot

![Screenshot](https://github.com/Bogdanescu22/Large-eCommerce-website-in-progress-/blob/main/fornt-end/public/Images/screencapture-localhost-3000-2025-03-14-12_23_37.png?raw=true)


## Features

- Product pages and shopping cart
- All products are also added to category pages (phones, headphones, accessories ... etc.) 
- User authentication and registration
- The admin has a special dashboard that only he has access to, protected by a middleware (you will see this in the js server). All routes he will have access to will be protected,will 
  have complete control over the site without having to use code. Will be able to add products, edit products, delete products, manage orders and possibly (I'm still thinking about it) 
  create new category pages. For now, that's all for the admin.
- Integration with payment methods  
- User dashboard (can I see order history, account details, added reviews)
- Users can add product reviews, which will first reach the admin and be reviewed by him.
- Search Bar for users. I created a search bar with postgresql full text search that also involves fuzzy search.
- More features, you will see if you use the site.
  
## Technologies Used

- **Frontend:** React, CSS, Javascript, HTML 
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  

## Installation and Setup

### 1. Clone the repository
```sh
git clone https://github.com/USERNAME/REPO-NAME.git
```

### 2. Install dependencies
```sh
cd fornt-end
npm install

cd ../back-end
npm install
```

### 3. Configure the `.env` file
Create a `.env` file and add:
```
SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SMTP_USER=your_smtp_email
SMTP_PASS=your_smtp_password
PORT=your_server_port
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
SESSION_SECRET=your_session_secret_key
DB_USER=your_database_user
DB_HOST=your_database_host
DB_DATABASE=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=your_database_port
STRIPE_PUBLIC_KEY=your_stripe_public_key
AWS_ACCES_KEY_ID=your_aws_acces_key
AWS_SECRET_ACCES_KEY_ID=your_aws_secret_acces_key
AWS_REGION=your_aws_region


```

### 4. Start the application

**Frontend:**
```sh
npm start
```

**Backend:**
```sh
nodemon server.js
```

## Author

Created by **Pantelimon Bogdan Mihai** – [GitHub](https://github.com/Bogdanescu22)

## License

All rights reserved. This project cannot be used, copied, modified, merged, published, distributed, sublicensed, or sold without permission from the copyright holder.
