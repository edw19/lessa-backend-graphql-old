export const getIva = (subtotal: number): string => {
    return (Number(subtotal) * 0.12).toFixed(2);
};
