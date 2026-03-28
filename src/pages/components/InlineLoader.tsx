import "../components/inlineLoader.scss";
export const InlineLoader = () => {
  return (
    <div className="inline-loader">
      <svg viewBox="-15 -15 100 100">
        <path d="M32 2C15.4 2 2 15.4 2 32s13.4 30 30 30s30-13.4 30-30S48.6 2 32 2" />
      </svg>
    </div>
  );
};
