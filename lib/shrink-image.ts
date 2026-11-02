/** Square-crops and shrinks a picture in the browser so uploads stay small (client-side only). */
export async function shrinkImage(file: File, size = 512): Promise<File> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const c = document.createElement("canvas");
  c.width = c.height = Math.min(size, side);
  c.getContext("2d")!.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, c.width, c.height);
  const blob: Blob = await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("blob"))), "image/jpeg", 0.88));
  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}
