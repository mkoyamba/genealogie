# Koyamba Family Tree Frontend

A React and TypeScript frontend for browsing and managing a family tree, family media, recipes, and a digital family book. The application displays members in an interactive infinite canvas, lets users add new family members, browse media by type, open media viewers, upload files to AWS S3, and connect media items to family members.

## Features

- Interactive family tree rendered on an infinite zoomable canvas
- Member creation form with name, birth date, gender, parents, and spouses
- Member detail popups from the family tree
- Media library split by videos, audio, pictures, and documents
- Recipe library with PDF viewer support
- Search bars for media and recipes
- File upload modal with drag-and-drop support
- AWS S3 uploads for active media and recipes
- API integration for members, media, recipes, and media/member associations
- Dedicated pages for the family book, credits, and recommendations
- React Router navigation between application pages

## Tech Stack

- React 19
- TypeScript
- Create React App / `react-scripts`
- React Router DOM
- React Bootstrap and Bootstrap
- AWS SDK for S3 uploads
- React Infinite Canvas
- React PDF / PDF.js
- React Player

## Project Structure

```text
public/                 Static public assets
src/
  assets/               Images, icons, avatars, and fonts
  modules/              Reusable UI modules and feature components
    components/         Popups, viewers, uploader, controls, workflow UI
    utils/              Utility functions such as tree building and API helpers
  pages/                Route-level pages
  App.tsx               Router configuration
  Types.tsx             Shared TypeScript types
  index.tsx             React entry point
package.json            Dependencies and npm scripts
tsconfig.json           TypeScript configuration
```

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Homepage with the family tree and member creation form |
| `/livre` | Embedded family book page |
| `/medias` | Media library for videos, audio, pictures, and documents |
| `/recettes` | Recipe library and PDF recipe viewer |
| `/credits` | Credits page |
| `/recommandations` | Recommendations page |
| `*` | 404 page |

Most routes use the `id` query parameter, for example:

```text
/?id=YOUR_ACCESS_ID
/medias?id=YOUR_ACCESS_ID
```

> Note: the current `checkPassword` utility always returns `true`. Replace it with real authentication or access validation before using this in production.

## Requirements

- Node.js 18 or newer recommended
- npm
- An AWS-backed API compatible with the endpoints used by the frontend
- An S3 bucket configured for browser uploads, if file upload is enabled

## Installation

```bash
npm install
```

### Start the development server

```bash
npm start
```

Runs the app in development mode at:

```text
http://localhost:3000
```

### Run tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

### Build for production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

### Eject Create React App configuration

```bash
npm run eject
```

This is a one-way operation. It copies the build configuration into the project so it can be customized manually.

## API Expectations

The frontend expects API responses that look similar to AWS DynamoDB attribute-value objects.

### Members

`GET /members` should return an array of members with fields such as:

```json
{
  "id": { "N": "1" },
  "surname": { "S": "Jane" },
  "name": { "S": "Doe" },
  "dateOfBirth": { "S": "01-01-1990" },
  "gender": { "S": "female" },
  "couple": { "NS": ["2", "-1"] },
  "parent1": { "S": "-1" },
  "parent2": { "S": "-1" },
  "prime": { "BOOL": true },
  "picture": { "S": "" }
}
```

`PUT /members` is used to create or update a member.

### Media and Recipes

`GET /medias` and `GET /recettes` should return arrays with fields such as:

```json
{
  "id": { "N": "1" },
  "name": { "S": "Family video" },
  "url": { "S": "https://example.com/media.mp4" },
  "extension": { "S": ".mp4" },
  "type": { "S": "video" },
  "membersId": { "NS": ["1", "2", "-1"] }
}
```

Supported media types in the frontend include:

- `video`
- `audio`
- `picture`
- `text`

`DELETE /medias` is used to delete a media item by URL/id payload.

## File Uploads

The `FileUploader` component uploads files to the S3 bucket named:

```text
koyamba-family-tree-files
```

The region is currently set to:

```text
eu-west-3
```

Upload destinations depend on the uploader context:

- Recipes are uploaded under `recipes/`
- Other active media files are uploaded under `active/`

## Development Notes

- The UI labels are currently mostly in French.
- Some pages, such as credits and recommendations, are placeholders.
- Several components rely on route state passed by navigation from the homepage. Directly opening nested routes may require defensive handling if no route state is present.
- The current password check is stubbed and should be replaced before deployment.
- Consider moving AWS upload credentials out of the frontend for production security.

## Deployment

Build the app with:

```bash
npm run build
```

Then deploy the generated `build/` folder to any static hosting provider, such as AWS S3 + CloudFront, Netlify, Vercel, or another static web host.

Make sure the production environment defines all required `REACT_APP_*` variables before building.

## License

No license is currently specified. Add a license file if this project will be shared or distributed.
