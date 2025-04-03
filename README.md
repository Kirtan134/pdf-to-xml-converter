# PDF to XML Converter

A modern web application that converts PDF documents to structured XML format with customizable output options, intelligent structure detection, and comprehensive document management.

## Live Demo

[Access the live demo](https://pdf-to-xml-converter-xi.vercel.app/)

## Features

- **Intelligent PDF Parsing**: Extracts text with position, formatting, and structural information
- **Multiple Structure Types**: 
  - **Basic**: Simple text extraction with position data
  - **Enhanced**: Paragraph and heading detection with basic formatting
  - **Full**: Complete structure detection including tables, lists, and images
- **Real-time Processing**: Status updates and progress indicators during conversion
- **Advanced Search**: Text search with highlighting in both PDF preview and XML output
- **Comprehensive Dashboard**: Filter, sort, and manage your conversion history
- **Multi-page Support**: Navigate through multi-page documents with pagination controls
- **User Preferences**: Customizable settings saved to your profile
- **Responsive Design**: Fully functional on desktop, tablet, and mobile devices
- **Accessibility Support**: WCAG AA-compliant with screen reader compatibility

## Setup Instructions

### Prerequisites

- Node.js 20.x or higher
- npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pdf-to-xml-converter.git
   cd pdf-to-xml-converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory based on `.env.example`:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secure-random-string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Technology Stack

### Core Technologies

- **Next.js 15.x**: React framework with server-side rendering and API routes
- **Prisma 6.x**: Type-safe ORM for database operations
- **NextAuth.js 4.x**: Authentication system with multiple provider support
- **Tailwind CSS 4.x**: Utility-first CSS framework for responsive design
- **TypeScript 5.x**: Static typing for improved code quality
- **PDF.js**: PDF rendering and parsing library
- **pdf-parse & pdf2json**: PDF extraction libraries
- **React 19.x**: UI library for component-based development
- **PostgreSQL**: Production database (with SQLite for development)

### Development Tools

- **ESLint 9.x**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Prisma Studio**: Database management UI

## Architecture and Design Decisions

### Why Next.js?

Next.js was chosen for its excellent developer experience and hybrid rendering capabilities. The framework provides:

1. **API Routes**: Built-in serverless functions for backend operations
2. **Server-Side Rendering**: Improved SEO and initial load performance
3. **File-based Routing**: Simplified navigation structure
4. **TypeScript Integration**: First-class support for type safety
5. **Built-in Optimizations**: Automatic code splitting and image optimization

### Why Prisma?

Prisma offers a type-safe database interface with several advantages:

1. **Schema-driven Development**: Database schema as the single source of truth
2. **Type Safety**: Generated TypeScript types for database models
3. **Migration Management**: Simplified database schema evolution
4. **Query Building**: Intuitive API for complex database operations
5. **Database Agnostic**: Easy switching between database providers

### Why Tailwind CSS?

Tailwind CSS enables rapid UI development with:

1. **Utility-first Approach**: Direct styling without context switching
2. **Consistency**: Predefined design system with constraints
3. **Responsive Design**: Built-in breakpoint utilities
4. **Dark Mode Support**: Simple implementation of theme switching
5. **Small Production Bundle**: PurgeCSS integration for minimal CSS

### Database Schema

The application uses a relational database with the following key models:

1. **User**: User accounts and authentication data
2. **Conversion**: PDF-to-XML conversion records
3. **UserPreferences**: User-specific settings and preferences

This schema supports the core functionality while maintaining referential integrity.

## PDF-to-XML Conversion Approach

### Conversion Pipeline

1. **File Upload & Validation**
   - Validate file type, size, and structure
   - Store temporarily for processing

2. **PDF Parsing**
   - Extract text content with position data
   - Identify fonts, styles, and embedded objects
   - Preserve page structure and layout

3. **Structure Analysis**
   - Identify document hierarchy (headings, paragraphs)
   - Detect tables based on layout analysis
   - Recognize lists by pattern matching
   - Extract embedded images

4. **XML Generation**
   - Create structured XML based on detected elements
   - Apply schema based on selected structure type
   - Preserve document fidelity with position attributes
   - Generate metadata (word count, character count, etc.)

5. **Post-processing**
   - Optimize XML for readability and size
   - Validate against schema (when applicable)
   - Store conversion result and statistics

### Structure Preservation Techniques

To maintain the original document structure, the application employs several techniques:

1. **Position-based Layout Analysis**: Preserves spatial relationships between elements
2. **Font Attribute Tracking**: Identifies headings and emphasized text
3. **Table Detection Algorithm**: Uses spatial analysis to identify tabular data
4. **List Recognition**: Identifies numbered and bulleted lists
5. **Hierarchical Organization**: Maintains document section hierarchy

### XML Structure Types

#### Basic Structure
```xml
<document>
  <page number="1">
    <text x="100" y="120" font="Arial" size="12">Sample text content</text>
    <!-- Additional text elements with position data -->
  </page>
</document>
```

#### Enhanced Structure
```xml
<document>
  <page number="1">
    <heading level="1">Document Title</heading>
    <paragraph>
      <text>First paragraph content with </text>
      <text style="bold">emphasized text</text>
      <text> and regular text.</text>
    </paragraph>
    <!-- Additional structured elements -->
  </page>
</document>
```

#### Full Structure
```xml
<document title="Sample Document">
  <metadata>
    <author>John Doe</author>
    <created>2023-07-15</created>
  </metadata>
  <page number="1">
    <heading level="1">Document Title</heading>
    <paragraph>Introductory paragraph...</paragraph>
    <table>
      <tr><th>Header 1</th><th>Header 2</th></tr>
      <tr><td>Data 1</td><td>Data 2</td></tr>
    </table>
    <list type="bullet">
      <item>First item</item>
      <item>Second item</item>
    </list>
    <image src="data:image/png;base64,..." x="150" y="300" width="200" height="150" />
  </page>
</document>
```

## User Experience Design

The application follows these UX principles:

1. **Progressive Disclosure**: Essential controls are immediately visible, with advanced options revealed when needed
2. **Consistent Feedback**: Status updates and progress indicators for all operations
3. **Error Prevention**: Validation before operations to prevent mistakes
4. **Accessibility**: WCAG AA compliance with keyboard navigation and screen reader support
5. **Responsive Layout**: Adapts to different screen sizes and orientations

## Project Structure

```
pdf-to-xml-converter/
├── src/                    # Source code
│   ├── app/                # Next.js pages and API routes
│   ├── components/         # React components
│   ├── lib/                # Utility functions and services
│   ├── types/              # TypeScript type definitions
│   └── middleware.ts       # Next.js middleware
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
└── ...
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
