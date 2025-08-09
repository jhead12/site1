import * as React from "react"
import { Link } from "./ui"
import {
  Container,
  Section,
  Flex,
  Box,
  Subhead,
  Heading,
  Text,
  Button
} from "./ui"
import "./top-selling-products.css"

export default function TopSellingProducts() {
  // Mock data for top selling products - replace with actual data source
  const topProducts = [
    {
      id: "1",
      title: "Trap Beats Vol. 1",
      price: "$29.99",
      originalPrice: "$39.99",
      image: "https://via.placeholder.com/300x200/1a1a1a/ffffff/?text=TRAP+BEATS",
      category: "Beat Pack",
      sales: 156,
      rating: 4.8,
      description: "Hard-hitting trap beats with heavy 808s and crisp hi-hats",
      href: "/shop/trap-beats-vol-1",
      badge: "Best Seller"
    },
    {
      id: "2", 
      title: "R&B Soul Pack",
      price: "$24.99",
      originalPrice: null,
      image: "https://via.placeholder.com/300x200/2d3748/ffffff/?text=R%26B+SOUL",
      category: "Beat Pack",
      sales: 134,
      rating: 4.9,
      description: "Smooth R&B instrumentals with soulful melodies",
      href: "/shop/rnb-soul-pack",
      badge: "Hot"
    },
    {
      id: "3",
      title: "Hip Hop Essentials",
      price: "$19.99", 
      originalPrice: "$29.99",
      image: "https://via.placeholder.com/300x200/4a5568/ffffff/?text=HIP+HOP",
      category: "Beat Pack",
      sales: 98,
      rating: 4.7,
      description: "Classic hip hop beats with boom bap drums",
      href: "/shop/hip-hop-essentials",
      badge: "Sale"
    },
    {
      id: "4",
      title: "Mixing Masterclass",
      price: "$49.99",
      originalPrice: null,
      image: "https://via.placeholder.com/300x200/1a365d/ffffff/?text=MIXING+CLASS",
      category: "Course",
      sales: 87,
      rating: 5.0,
      description: "Complete mixing course with pro techniques",
      href: "/shop/mixing-masterclass",
      badge: "New"
    }
  ]

  return (
    <Section padding={5} background="primary">
      <Container>
        <Box center marginBottom={4}>
          <Heading as="h2" variant="primary" style={{ color: "white", marginBottom: "1rem" }}>
            🔥 Top Selling Products
          </Heading>
          <Text variant="lead" style={{ color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "0 auto" }}>
            Get the beats and courses that producers are loving. Limited time offers available!
          </Text>
        </Box>

        <Flex gap={4} variant="wrap" style={{ justifyContent: "center" }}>
          {topProducts.map((product) => (
            <Box 
              key={product.id} 
              className="product-card"
              style={{ 
                flex: "1",
                minWidth: "280px",
                maxWidth: "320px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                overflow: "hidden",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease",
                position: "relative"
              }}
            >
              {/* Badge */}
              {product.badge && (
                <div className="product-badge" style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: product.badge === "Sale" ? "#e53e3e" : 
                             product.badge === "Hot" ? "#dd6b20" :
                             product.badge === "New" ? "#38a169" : "#3182ce",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  zIndex: 1
                }}>
                  {product.badge}
                </div>
              )}

              {/* Product Image */}
              <Box style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                <Link to={product.href}>
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  />
                </Link>
                
                {/* Quick Play Button Overlay */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "rgba(0,0,0,0.7)",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  cursor: "pointer"
                }}>
                  <span style={{ color: "white", fontSize: "1.2rem" }}>▶</span>
                </div>
              </Box>

              {/* Product Info */}
              <Box padding={3}>
                <Text variant="kicker" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  {product.category}
                </Text>
                
                <Heading as="h3" style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  <Link to={product.href} style={{ color: "inherit", textDecoration: "none" }}>
                    {product.title}
                  </Link>
                </Heading>
                
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginBottom: "1rem", lineHeight: "1.4" }}>
                  {product.description}
                </Text>

                {/* Rating & Sales */}
                <Flex style={{ alignItems: "center", marginBottom: "1rem", fontSize: "0.8rem" }}>
                  <div style={{ color: "#ffd700" }}>
                    {"★".repeat(Math.floor(product.rating))} {product.rating}
                  </div>
                  <Text style={{ color: "rgba(255,255,255,0.6)", marginLeft: "1rem" }}>
                    {product.sales} sales
                  </Text>
                </Flex>

                {/* Price */}
                <Flex style={{ alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <Text variant="bold" style={{ color: "white", fontSize: "1.2rem" }}>
                      {product.price}
                    </Text>
                    {product.originalPrice && (
                      <Text style={{ 
                        color: "rgba(255,255,255,0.6)", 
                        textDecoration: "line-through",
                        fontSize: "0.9rem",
                        marginLeft: "0.5rem"
                      }}>
                        {product.originalPrice}
                      </Text>
                    )}
                  </div>
                </Flex>

                {/* Action Buttons */}
                <Flex gap={2}>
                  <Button 
                    to={product.href}
                    variant="primary"
                    style={{ 
                      flex: 1,
                      background: "white",
                      color: "#1a202c",
                      border: "none",
                      fontWeight: "bold",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Buy Now
                  </Button>
                  <button
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minWidth: "45px"
                    }}
                    title="Preview"
                  >
                    ▶
                  </button>
                </Flex>
              </Box>
            </Box>
          ))}
        </Flex>

        {/* View All Products CTA */}
        <Box center marginTop={5}>
          <Button 
            to="/shop" 
            variant="reversed"
            style={{ 
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              background: "rgba(255,255,255,0.1)",
              border: "2px solid white",
              color: "white",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
          >
            View All Products →
          </Button>
        </Box>
      </Container>
    </Section>
  )
}
