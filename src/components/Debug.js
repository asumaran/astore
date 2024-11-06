export default function Debug({ cartToken }) {
  return (
    <code>
      Debug <br />
      Cart Token:{" "}
      {cartToken
        ? "Cart Token:" + cartToken.slice(0, 20) + "..." + cartToken.slice(-20)
        : "No Cart Token"}
    </code>
  );
}
