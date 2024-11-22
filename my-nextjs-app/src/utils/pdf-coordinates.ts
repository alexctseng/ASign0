interface PageDimensions {
    width: number
    height: number
  }
  
  export function viewportToPageCoordinates(
    viewportX: number,
    viewportY: number,
    pageNumber: number,
    pageDimensions: PageDimensions,
    scale: number
  ) {
    const pageX = (viewportX / (pageDimensions.width * scale)) * 100
    const pageY = (viewportY / (pageDimensions.height * scale)) * 100
  
    return { pageX, pageY, pageNumber }
  }
  
  export function pageToViewportCoordinates(
    pageX: number,
    pageY: number,
    pageNumber: number,
    pageDimensions: PageDimensions,
    scale: number
  ) {
    const viewportX = (pageX * pageDimensions.width * scale) / 100
    const viewportY = (pageY * pageDimensions.height * scale) / 100
  
    return { viewportX, viewportY }
  }