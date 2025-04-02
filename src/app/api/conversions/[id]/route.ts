import { prisma } from "@/lib/db-fixed";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversionId = params.id;

    if (!conversionId) {
      return NextResponse.json(
        { error: "Conversion ID is required" },
        { status: 400 }
      );
    }

    // Check if conversion exists, no auth check
    const query = `
      SELECT * FROM "conversion"
      WHERE id = $1
      LIMIT 1
    `;
    
    const results = await prisma.$queryRaw(query, conversionId);
    const conversion = results[0];

    if (!conversion) {
      return NextResponse.json(
        { error: "Conversion not found" },
        { status: 404 }
      );
    }

    // Get only the page requested if specified
    const pageParam = request.nextUrl.searchParams.get('page');
    let xmlContent = conversion.convertedXml;
    
    if (pageParam && conversion.pageCount > 1) {
      const page = parseInt(pageParam);
      if (!isNaN(page) && page >= 1 && page <= conversion.pageCount) {
        const pageStartTag = `<page number="${page}">`;
        const pageEndTag = `</page>`;
        
        const pageStartIndex = conversion.convertedXml.indexOf(pageStartTag);
        const pageEndIndex = conversion.convertedXml.indexOf(pageEndTag, pageStartIndex) + pageEndTag.length;
        
        if (pageStartIndex !== -1 && pageEndIndex !== -1) {
          // Create a valid XML document with just this page
          xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<document>\n' + 
                       conversion.convertedXml.substring(pageStartIndex, pageEndIndex) +
                       '\n</document>';
        }
      }
    }
    
    // Parse metadata if present
    let metadata = {};
    if (conversion.metadata) {
      try {
        metadata = JSON.parse(conversion.metadata);
      } catch (e) {
        console.error("Error parsing metadata:", e);
        metadata = {};
      }
    }
    
    // Parse tags if present
    let tags: string[] = [];
    if (conversion.tags) {
      try {
        tags = JSON.parse(conversion.tags);
      } catch (e) {
        console.error("Error parsing tags:", e);
        tags = [];
      }
    }

    // Return conversion data
    return NextResponse.json({
      conversion: {
        id: conversion.id,
        filename: conversion.filename,
        status: conversion.status,
        createdAt: conversion.createdAt,
        structureType: conversion.structureType,
        pageCount: conversion.pageCount,
        fileSize: conversion.fileSize,
        xmlContent,
        wordCount: conversion.wordCount,
        characterCount: conversion.characterCount,
        detectedTables: conversion.detectedTables,
        detectedLists: conversion.detectedLists,
        detectedHeadings: conversion.detectedHeadings,
        detectedImages: conversion.detectedImages,
        processingTime: conversion.processingTime,
        metadata,
        tags,
      },
      fullPageCount: conversion.pageCount,
      statistics: {
        detectedTables: conversion.detectedTables || 0,
        detectedLists: conversion.detectedLists || 0,
        detectedHeadings: conversion.detectedHeadings || 0, 
        detectedImages: conversion.detectedImages || 0,
        processingTime: conversion.processingTime || 0,
        characterCount: conversion.characterCount || 0,
        wordCount: conversion.wordCount || 0,
      }
    });
  } catch (error) {
    console.error("Error getting conversion:", error);
    return NextResponse.json(
      { error: "Failed to get conversion" },
      { status: 500 }
    );
  }
} 