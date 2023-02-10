export const getSubTotal = (total: number) => {
    return +(Number(total) / 1.12).toFixed(2);
};
