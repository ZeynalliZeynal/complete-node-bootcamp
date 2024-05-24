module.exports = (temp, product) => {
  let output = temp.replaceAll("{%PRODUCT_NAME%}", product.productName);
  output = output.replaceAll("{%PRODUCT_IMAGE%}", product.image);
  output = output.replaceAll("{%PRODUCT_PRICE%}", product.price);
  output = output.replaceAll("{%PRODUCT_FROM%}", product.from);
  output = output.replaceAll("{%PRODUCT_NUTRIENTS%}", product.nutrients);
  output = output.replaceAll("{%PRODUCT_QUANTITY%}", product.quantity);
  output = output.replaceAll("{%PRODUCT_DESCRIPTION%}", product.description);
  output = output.replaceAll("{%PRODUCT_ID%}", product.id);
  if (!product.organic)
    output = output.replaceAll("{%NOT_ORGANIC%}", "not-organic");

  return output;
};
