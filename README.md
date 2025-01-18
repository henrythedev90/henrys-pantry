# Henry's Pantry

**_Henry's Pantry_** is a web app designed to help users find recipes based on the ingredients they already have at home. By integrating with a recipe API (e.g., Spoonacular), the app minimizes food waste, inspires creativity in the kitchen, and makes meal planning easier.

## Goals of the Project

1. Efficient Meal Planning
   - Help users discover recipes that match their available pantry items.
2. Reduce Food Waste
   - Encourage users to use up ingredients they already have before buying new ones.
3. Promote Creativity
   - Provide tailored recipe ideas, sparking inspiration to try new dishes.
4. Optimize User Experience
   - Offer a fast, user-friendly interface with clear navigation and minimal effort required.

## Key Features

- Search for recipes based on pantry ingredients.
- Cache fetched recipes to optimize performance and reduce external API calls.
- Responsive UI for seamless use across all devices.
- User-friendly interface with clean animations and smooth transitions.

## Tech Stack

### Front-End

- Next.js: Framework for server-rendered React applications, ensuring fast load times and SEO optimization.
- React: For building reusable UI components.
- Framer Motion: Adds smooth animations and transitions to enhance the user experience.
- Tailwind CSS: For rapid, responsive, and customizable styling.

### Back-End

- Next.js API Routes: Provides a robust and scalable API backend.
- MongoDB: Database for caching recipes and storing user data.
- Spoonacular API: External API for fetching recipes based on pantry ingredients.

### Other Tools

- Vercel: For deploying the app with ease.
- dotenv: For managing environment variables securely.

### Usage

1.  Enter the ingredients you have in your pantry.
2.  Hit search to fetch recipes based on those ingredients.
3.  Explore the list of recipes, including images, missing ingredient counts, and other details.

### Future Enhancements

- User authentication and saved recipes functionality.
- Support for dietary preferences and restrictions (e.g., vegan, gluten-free).
- Advanced search filters for cuisines, prep time, and difficulty.
- Mobile app integration.

## Setup and Installation

### Prerequisites

1. Node.js installed on your system.
2. A MongoDB instance (Atlas or local).
3. Spoonacular API key.

### Steps

1. Clone the repository:

`git clone https://github.com/your-username/pantry-to-plate.git`
`cd pantry-to-plate`

2. Install dependencies:

`npm install`

3. Create a .env.local file in the root directory and add the following:

`MONGODB_URI=<your-mongodb-connection-string>`
`MONGODB_DB=<your-database-name>`
`SPOONACULAR_API_KEY=<your-spoonacular-api-key>`

4. Run the development server:

`npm run dev`

5. Open http://localhost:3000 to view it in the browser.

[Visit Me!](https://www.henry-nunez.com)
