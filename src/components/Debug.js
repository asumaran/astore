export default function Debug({ cartToken }) {
  return (
    <code>
      Debug: <br />
      Cart Token: {cartToken.slice(0, 20)}...{cartToken.slice(-20)}
    </code>
  );
}
