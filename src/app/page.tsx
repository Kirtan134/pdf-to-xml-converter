import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session;

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900">
        PDF to XML Converter
      </h1>
      <p className="text-xl text-center max-w-3xl mb-10 text-gray-800">
        Convert your PDF documents to structured XML format while preserving the
        document structure and formatting. Perfect for data extraction,
        analysis, and document processing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">Preserve Structure</h2>
          <p className="text-gray-800">
            Our conversion maintains the original document's layout, text
            positions, and formatting.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">Easy to Use</h2>
          <p className="text-gray-800">
            Simply upload your PDF file, and we'll convert it to a
            well-structured XML document in seconds.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">History &amp; Management</h2>
          <p className="text-gray-800">
            Access your conversion history, and download or copy your XML files
            anytime you need them.
          </p>
        </div>
      </div>

      {isAuthenticated ? (
        <Link
          href="/convert"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md text-lg transition-colors"
        >
          Convert Your PDF
        </Link>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md text-lg transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-md text-lg border border-blue-600 transition-colors"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
