export function successResponse(data, message = null) {
  return {
    success: true,
    ...(message && { message }),
    data
  };
}

export function errorResponse(error, statusCode = 500) {
  return {
    success: false,
    error: typeof error === 'string' ? error : error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack
    })
  };
}

export function paginatedResponse(data, page, limit, total) {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export default {
  successResponse,
  errorResponse,
  paginatedResponse
};
