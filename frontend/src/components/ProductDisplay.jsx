const ProductDisplay = ({ product, error }) => {
    return (
        <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", marginTop: "10px" }}>
            {error ? (
                <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
            ) : product ? (
                <div>
                    <h3>🛒 {product.name}</h3>
                    <p>💰 Price: <strong>₹{product.price.toFixed(2)}</strong></p>
                </div>
            ) : (
                <p style={{ color: "#777" }}>Scan a barcode to see product details.</p>
            )}
        </div>
    );
};

export default ProductDisplay;
