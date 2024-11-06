export default function Currency({ amount, code = "USD" }) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  });
  return <span>{formatter.format(amount / 100)}</span>;
}
