export type ExtractedImage = {
  pageNumber: number;
  index: number;
  blob: Blob;
  width: number;
  height: number;
  source: 'embedded' | 'rendered';
};

export type PageRangeParseResult = {
  indices: number[];
  invalidTokens: string[];
};
