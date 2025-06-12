
  

# 🛠️ Mini Website Builder (Laravel + Vue.js)

  
A modular, user-friendly website builder that enables authenticated users to create, customize, and manage multi-section pages with live previews. Built with a clean, API-driven Laravel backend and a dynamic Vue 3 single-page frontend, this project showcases thoughtful architectural design and component-driven development.

---

  

## 🚀 Features Implemented

  

### 🔐 Authentication

- User login using Laravel Sanctum and Vue composition API.

- Authenticated API routes and route guards.

  

### 🧱 Website Builder Core

- Users can:

- Add/edit/delete pages .

- Add/edit/reorder/remove/live preview sections to a page.

- Supported section types:

	- Header

	- Text

	- HTML

	- Image

  

### 🖥️ Live Preview

- Real-time preview of page structure as users modify content using Vue reactivity.

  

### 🧩 Modular & Clean Code

- API: RESTful structure using Laravel Resources & Service Layer.

- Frontend: Vue 3 with Composition API and reusable UI components.

- Fully separated frontend and backend (API-first architecture).

  
  

---

  

## 🧠 Key Decisions & Why

-   **Page-Section Relationship:**  
    Modeled a one-to-many relationship where a Page has many Sections. This reflects the real-world concept of a webpage made up of multiple content blocks.
    
-   **Typed Sections Using Enums:**  
    Used an enum to strictly define valid section types (`header`, `text`, `html`, `image`). This enforces data consistency and makes frontend rendering logic simpler.
    
-   **Drag-and-Drop Section Ordering:**  
    Implemented a `position` attribute on sections to track their order. This allows users to reorder sections via drag-and-drop, giving flexible control over page layout.
    
-   **API-First Design:**  
    Designed backend as an API with endpoints to create, update, reorder, and delete pages and sections, enabling smooth frontend interaction and future extensibility.
    
-   **Laravel Sanctum Authentication:**  
    Secured API routes with token-based authentication to protect user data and ensure only authorized users can manage their pages.
    
-   **Vue.js Component-Based UI:**  
    Developed reusable Vue components for each section type, facilitating dynamic rendering and live preview of page content.
    
-   **Test-Driven Approach:**  
    Added unit and feature tests to cover critical workflows including section syncing, ordering, and CRUD operations, ensuring reliability.
    
-   **Clean and Maintainable Code:**  
    Focused on readable code and clear naming conventions to make future enhancements and onboarding easier.
  

### 🔨 Laravel + Vue SPA (Decoupled)

Opted for a fully decoupled architecture with Vue SPA and Laravel API to allow future scalability (e.g., mobile app, static site generator).

  

### 📦 Section Type Enum

Used `BenSampo/Laravel-Enum` for strict and validated section types. Enforced valid types during creation and updates.

  

### 🧪 API & Unit Tests

Prioritized backend testing for business logic and API endpoints. Used `actingAs()` with Sanctum for authenticated routes.

  

### ♻️ Clean Architecture

Introduced service classes (e.g., `PageService`) for separation of business logic from controllers, enabling better testability and maintainability.

  

---

  

## 🧱 Project Structure

- backend/

- app/Models/Page, Section

- app/Services/PageService.php

- app/Http/Controllers/API/Auth/

	- LoginController.php

- app/Http/Controllers/AP/

	- PageController.php

- app/Enums/SectionType.php

- routes/api.php

- tests/Unit, Feature

- frontend/

	- components/

		- Login.vue
	
		- PageList.vue
	
		- PageEditor.vue

	- components/layouts

		- AdminLayout.vue
		
		- LoginLayout.vue

- views/

	- Home.vue
	
	- Login.vue
	
	- Page.vue.
	
	- PageCreate.vue
	
	- PageEdit.vue

- router/

	- index.js

- store/

	- auth.js
	
	- page.js

---

  

## 📌 Setup Instructions
### Prerequisites

**Make sure you have installed:**

-   PHP ≥ 8.2
-   Composer
-   Node.js ≥ 18.x
-   npm or yarn
-   MySQL / PostgreSQL
  
### Clone Repo

```bash

git  clone  https://github.com/devbik069/mini-website-builder.git

cd  mini-website-builder

```

### Backend (Laravel)

##### Step 1: Navigate to your backend folder

```

cd backend
```
#### Step 2: Install PHP dependencies with Composer

```
composer install
```
##### Step 3: Create the environment file

```
cp .env.example .env
```
##### Step 4: Configure the database connection

Open `.env` in a text editor and update the database settings, for example:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

Replace these with your actual database credentials.
```
----------

##### Step 5: Generate application key

```
php artisan key:generate
```
#### Step 6: Run migrations and seed the database

```
php artisan migrate --seed
```
#### Step 7: Create symbolic link for storage

```

php artisan storage:link
```
#### Step 8: Serve the application

```
php artisan serve
```


### Frontend (Vue 3)

```bash

cd  frontend

npm  install

npm  run  dev

```

---
### Login Credentials 

```
admin@example.com
password
```
---
### ✅ Testing

- Unit tests for `PageService` methods.

- Tests include:

- Unit tests for `PageService`

- Feature tests for authenticated API usage

- Validation and authorization scenarios

- Feature tests for API endpoints using Sanctum-authenticated requests.

### Run Unit Test

```bash

php  artisan  test

or 

./vendor/bin/phpunit

  
or

 
php  artisan  test  --filter=PageServiceTest

```

  

### Run API Feature Tests

  

```bash

php  artisan  test  --filter=PageApiTest

```

---

## ⏱️ Time Spent

  

- ~12 hours over 3 evenings and 1 weekend day.

  

## 🌱 If I Had More Time...

  

- Add soft-deletion and undo functionality.

- Generate public preview URLs using Laravel signed routes.

- Add more unit and feature tests.

- Dockerize for production setup.

- Site Settings for page settings such as full width, grid, styles
