/**
 * El backend puede enviar el precio como número o como objeto { amount, currency }.
 * Esta función devuelve siempre el monto numérico para mostrar o calcular.
 */
export const getPriceAmount = (price) => {
  if (price == null) return 0;
  if (typeof price === 'object' && price !== null && 'amount' in price) {
    return Number(price.amount) || 0;
  }
  return Number(price) || 0;
};
