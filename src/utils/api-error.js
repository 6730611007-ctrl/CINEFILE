export function getApiErrorMessage(error) {
  if (error.response?.status === 404) {
    return error.response.data?.message || 'ไม่พบข้อมูลที่ต้องการ'
  }

  return error.response?.data?.message || error.message || 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง'
}
