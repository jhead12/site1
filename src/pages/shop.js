import React, { useState, useEffect, useMemo } from "react"
import Layout from "../components/layout"
import {
  Container,
  Section,
  Box,
  Heading,
  Text,
  Flex,
  FlexList,
  Kicker,
  Space,
  Subhead,
  Button
} from "../components/ui"
import SEOHead from "../components/head"

// ThriveCart Product Component
function ThriveCartProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Beat Licenses': return '🎵';
      case 'Beat Packages': return '📦';
      case 'Education': return '🎓';
      default: return '🎶';
    }
  };

  const getContractTypeInfo = (contractType) => {
    const types = {
      'non_exclusive': { label: 'Non-Exclusive', color: '#3b82f6', textColor: 'white' },
      'exclusive_licensing': { label: 'Enhanced Rights', color: '#8b5cf6', textColor: 'white' },
      'buyout': { label: 'Exclusive Buyout', color: '#ef4444', textColor: 'white' },
      'course_access': { label: 'Educational', color: '#10b981', textColor: 'white' }
    };
    return types[contractType] || { label: 'Standard', color: '#6b7280', textColor: 'white' };
  };

  const contractInfo = getContractTypeInfo(product.contractType);

  const handlePurchase = () => {
    // ThriveCart checkout integration
    const account = process.env.GATSBY_THRIVECART_ACCOUNT || 'nomoneyblanks';
    
    if (typeof window !== 'undefined') {
      // Use ThriveCart direct checkout URL
      const checkoutUrl = `https://thrivecart.com/checkout/${account}/${product.id}`;
      window.open(checkoutUrl, '_blank');
    }
  };

  return (
    <Box
      backgroundColor="white"
      borderRadius={3}
      boxShadow="medium"
      overflow="hidden"
      transition="all 0.3s ease"
      style={{
        border: '1px solid #e5e7eb',
        '&:hover': {
          boxShadow: 'large',
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Product Header */}
      <Box padding={4} borderBottom="1px solid #e5e7eb" backgroundColor="white">
        <Flex justifyContent="space-between" alignItems="flex-start" marginBottom={2}>
          <Text fontSize={5}>{getCategoryIcon(product.category)}</Text>
          {product.popular && (
            <Box
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: 'bold'
              }}
            >
              Popular
            </Box>
          )}
        </Flex>
        
        <Heading as="h3" variant="subheadLarge" marginBottom={2} style={{ color: '#111827' }}>
          {product.name}
        </Heading>
        
        <Flex justifyContent="space-between" alignItems="center" marginBottom={3}>
          <Text fontSize={5} fontWeight="bold" style={{ color: '#059669' }}>
            {formatPrice(product.price)}
          </Text>
          <Box
            style={{
              backgroundColor: contractInfo.color,
              color: contractInfo.textColor,
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '12px',
              fontWeight: 'bold'
            }}
          >
            {contractInfo.label}
          </Box>
        </Flex>
        
        <Text variant="body" style={{ color: '#6b7280', lineHeight: '1.6' }}>
          {product.description}
        </Text>
      </Box>

      {/* Features List */}
      <Box padding={4} backgroundColor="white">
        <Text fontWeight="medium" marginBottom={3} style={{ color: '#111827' }}>What's Included:</Text>
        <Box as="ul" style={{ listStyle: 'none', padding: 0 }}>
          {product.features.map((feature, index) => (
            <Box as="li" key={index} marginBottom={2} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Text style={{ color: '#059669', marginRight: '8px', marginTop: '2px', fontWeight: 'bold' }}>✓</Text>
              <Text fontSize={2} style={{ color: '#374151', lineHeight: '1.5' }}>{feature}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Product Details */}
      <Box padding={4} borderTop="1px solid #e5e7eb" style={{ backgroundColor: '#f9fafb' }}>
        <Flex gap={4}>
          <Box flex="1">
            <Text fontWeight="medium" fontSize={2} style={{ color: '#111827' }}>Usage Rights</Text>
            <Text fontSize={2} style={{ color: '#6b7280' }}>{product.usageRights}</Text>
          </Box>
          <Box flex="1">
            <Text fontWeight="medium" fontSize={2} style={{ color: '#111827' }}>Delivery</Text>
            <Text fontSize={2} style={{ color: '#6b7280' }}>{product.delivery}</Text>
          </Box>
        </Flex>
      </Box>

      {/* Purchase Button */}
      <Box padding={4} borderTop="1px solid #e5e7eb" backgroundColor="white">
        <Button 
          variant="primary" 
          size="large" 
          onClick={handlePurchase}
          style={{ 
            width: '100%',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Purchase Now - {formatPrice(product.price)}
        </Button>
        <Box textAlign="center" marginTop={2}>
          <Text fontSize={1} style={{ color: '#6b7280' }}>
            <a href="/contracts" style={{ color: '#6b7280', textDecoration: 'underline' }}>
              View contract details →
            </a>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

// Filter component for products
function ProductFilters({ filters, activeFilters, setActiveFilters }) {
  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value === "all" ? "" : value
    }))
  }

  return (
    <Box marginY={4} padding={4} backgroundColor="white" borderRadius={3} boxShadow="medium">
      <Subhead marginBottom={3} style={{ color: '#111827' }}>Filter Products</Subhead>
      
      {/* Category Filter */}
      {filters.categories.length > 0 && (
        <Box marginBottom={3}>
          <Text fontWeight="bold" marginBottom={2} style={{ color: '#374151' }}>Category</Text>
          <FlexList gap={2} wrap>
            <Button 
              variant={!activeFilters.category ? "primary" : "secondary"}
              onClick={() => handleFilterChange("category", "all")}
              size="small"
              style={{
                backgroundColor: !activeFilters.category ? '#3b82f6' : '#f3f4f6',
                color: !activeFilters.category ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '14px'
              }}
            >
              All
            </Button>
            {filters.categories.map(category => (
              <Button
                key={category}
                variant={activeFilters.category === category ? "primary" : "secondary"}
                onClick={() => handleFilterChange("category", category)}
                size="small"
                style={{
                  backgroundColor: activeFilters.category === category ? '#3b82f6' : '#f3f4f6',
                  color: activeFilters.category === category ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '14px'
                }}
              >
                {category}
              </Button>
            ))}
          </FlexList>
        </Box>
      )}
      
      {/* Product Type Filter */}
      {filters.productTypes.length > 0 && (
        <Box marginBottom={3}>
          <Text fontWeight="bold" marginBottom={2} style={{ color: '#374151' }}>Product Type</Text>
          <FlexList gap={2} wrap>
            <Button 
              variant={!activeFilters.productType ? "primary" : "secondary"}
              onClick={() => handleFilterChange("productType", "all")}
              size="small"
              style={{
                backgroundColor: !activeFilters.productType ? '#3b82f6' : '#f3f4f6',
                color: !activeFilters.productType ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '14px'
              }}
            >
              All
            </Button>
            {filters.productTypes.map(type => (
              <Button
                key={type}
                variant={activeFilters.productType === type ? "primary" : "secondary"}
                onClick={() => handleFilterChange("productType", type)}
                size="small"
                style={{
                  backgroundColor: activeFilters.productType === type ? '#3b82f6' : '#f3f4f6',
                  color: activeFilters.productType === type ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '14px'
                }}
              >
                {type}
              </Button>
            ))}
          </FlexList>
        </Box>
      )}
      
      {/* Tags Filter */}
      {filters.tags.length > 0 && (
        <Box>
          <Text fontWeight="bold" marginBottom={2} style={{ color: '#374151' }}>Tags</Text>
          <FlexList gap={2} wrap>
            <Button 
              variant={!activeFilters.tag ? "primary" : "secondary"}
              onClick={() => handleFilterChange("tag", "all")}
              size="small"
              style={{
                backgroundColor: !activeFilters.tag ? '#3b82f6' : '#f3f4f6',
                color: !activeFilters.tag ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '14px'
              }}
            >
              All
            </Button>
            {filters.tags.map(tag => (
              <Button
                key={tag}
                variant={activeFilters.tag === tag ? "primary" : "secondary"}
                onClick={() => handleFilterChange("tag", tag)}
                size="small"
                style={{
                  backgroundColor: activeFilters.tag === tag ? '#3b82f6' : '#f3f4f6',
                  color: activeFilters.tag === tag ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '14px'
                }}
              >
                {tag}
              </Button>
            ))}
          </FlexList>
        </Box>
      )}
    </Box>
  )
}

export default function ShopPage() {
  // Check if ThriveCart products are properly configured
  const hasRealProducts = !!(
    process.env.GATSBY_THRIVECART_BEAT_BASIC_ID &&
    process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID &&
    process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID &&
    process.env.GATSBY_THRIVECART_BEAT_PACK_ID &&
    process.env.GATSBY_THRIVECART_MASTERCLASS_ID
  );

  // ThriveCart product catalog
  const allProducts = [
    {
      id: process.env.GATSBY_THRIVECART_BEAT_BASIC_ID || '18',
      name: 'Basic Beat License',
      price: 50.00,
      category: 'Beat Licenses',
      productType: 'Beat License',
      tags: ['Basic', 'Commercial', 'Non-Exclusive'],
      description: 'Non-exclusive license for independent artists and content creators',
      features: [
        'MP3 and WAV files included',
        'Commercial use rights',
        'Up to 10,000 streams/plays',
        'Basic mixing stems available',
        'Producer credit required'
      ],
      contractType: 'non_exclusive',
      usageRights: 'Commercial use with limitations',
      delivery: 'Instant download',
      popular: false
    },
    {
      id: process.env.GATSBY_THRIVECART_BEAT_PREMIUM_ID || 'beat-premium',
      name: 'Premium Beat License',
      price: 150.00,
      category: 'Beat Licenses',
      productType: 'Beat License',
      tags: ['Premium', 'Extended Rights', 'Stems'],
      description: 'Enhanced license with extended commercial rights',
      features: [
        'High-quality WAV and MP3 files',
        'Extended commercial use rights',
        'Up to 100,000 streams/plays',
        'Individual stems/tracks included',
        'Radio and TV sync rights',
        'Producer credit required'
      ],
      contractType: 'exclusive_licensing',
      usageRights: 'Extended commercial use',
      delivery: 'Instant download + email',
      popular: true
    },
    {
      id: process.env.GATSBY_THRIVECART_BEAT_EXCLUSIVE_ID || 'beat-exclusive',
      name: 'Exclusive Beat License',
      price: 1000.00,
      category: 'Beat Licenses',
      productType: 'Beat License',
      tags: ['Exclusive', 'Buyout', 'Master Quality'],
      description: 'Complete exclusive rights with full commercial ownership',
      features: [
        'Master-quality files (WAV, MP3)',
        'Complete exclusive commercial rights',
        'Unlimited streams/distribution',
        'Full stem package included',
        'Trackouts and MIDI files',
        'Beat removed from marketplace',
        'Producer credit optional',
        'Custom mixing available'
      ],
      contractType: 'buyout',
      usageRights: 'Full exclusive ownership',
      delivery: 'Professional package + consultation',
      popular: false
    },
    {
      id: process.env.GATSBY_THRIVECART_BEAT_PACK_ID || 'beat-pack',
      name: 'Beat Pack Bundle',
      price: 200.00,
      category: 'Beat Packages',
      productType: 'Beat Package',
      tags: ['Bundle', 'Discount', 'Variety'],
      description: 'Curated collection of 5 premium beats',
      features: [
        '5 handpicked beats (MP3 + WAV)',
        'Non-exclusive commercial licenses',
        'Mixed and mastered quality',
        'Variety of styles and tempos',
        'Individual stems for each beat',
        'Bulk licensing discount',
        'Producer credit required'
      ],
      contractType: 'non_exclusive',
      usageRights: 'Commercial use per beat',
      delivery: 'ZIP download package',
      popular: true
    },
    {
      id: process.env.GATSBY_THRIVECART_MASTERCLASS_ID || 'masterclass',
      name: 'Producer Masterclass',
      price: 600.00,
      category: 'Education',
      productType: 'Course',
      tags: ['Education', 'Masterclass', 'Production'],
      description: 'Comprehensive music production course with J. Eldon',
      features: [
        '8+ hours of video content',
        'Beat making from scratch tutorials',
        'Mixing and mastering techniques',
        'Industry insider knowledge',
        'Project files and samples included',
        '1-on-1 feedback session',
        'Certificate of completion',
        'Lifetime access'
      ],
      contractType: 'course_access',
      usageRights: 'Educational license',
      delivery: 'Online course platform',
      popular: false
    }
  ];

  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [activeFilters, setActiveFilters] = useState({
    productType: "",
    tag: "",
    category: ""
  })

  // Extract all available filters from products
  const filters = {
    productTypes: [...new Set(allProducts.map(p => p.productType))],
    tags: [...new Set(allProducts.flatMap(p => p.tags || []))],
    categories: [...new Set(allProducts.map(p => p.category))]
  }

  // Filter products when active filters change
  useEffect(() => {
    let result = [...allProducts]
    
    // Apply category filter
    if (activeFilters.category) {
      result = result.filter(p => p.category === activeFilters.category)
    }
    
    // Apply product type filter
    if (activeFilters.productType) {
      result = result.filter(p => p.productType === activeFilters.productType)
    }
    
    // Apply tag filter
    if (activeFilters.tag) {
      result = result.filter(p => p.tags && p.tags.includes(activeFilters.tag))
    }
    
    setFilteredProducts(result)
  }, [activeFilters, allProducts])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Layout>
      <Section paddingY={5} style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        <Container>
          <Box textAlign="center" marginBottom={5} padding={4} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Kicker style={{ color: '#6b7280' }}>J. Eldon Music Store</Kicker>
            <Heading as="h1" style={{ color: '#111827', marginBottom: '16px' }}>Professional Beats & Courses</Heading>
            <Text variant="lead" style={{ color: '#374151', marginBottom: '8px' }}>High-quality beats, exclusive licenses, and production education</Text>
            <Space size={2} />
            <Text fontSize={2} style={{ color: '#6b7280' }}>
              All purchases include instant download and professional contracts
            </Text>
          </Box>

          {/* Quick Navigation */}
          <Box marginBottom={5} padding={4} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Heading as="h2" marginBottom={3} style={{ color: '#111827' }}>
              Quick Navigation
            </Heading>
            <FlexList gap={3} wrap>
              <Button
                as="a"
                href="/beats"
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🎵 Browse Individual Beats
              </Button>
              <Button
                as="a"
                href="/auth/user/analytics"
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📊 Analytics Dashboard
              </Button>
              <Button
                as="a"
                href="/auth/user/contracts"
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📄 My Contracts
              </Button>
            </FlexList>
            <Text fontSize={2} style={{ color: '#6b7280', marginTop: '12px' }}>
              New: Browse individual beats with preview and instant licensing at <strong>/beats</strong>
            </Text>
          </Box>
          
          {/* Setup Notice for Placeholder Data */}
          {!hasRealProducts && (
            <Box marginBottom={5} padding={4} backgroundColor="white" borderRadius={3} boxShadow="medium" style={{ border: '2px solid #f59e0b' }}>
              <Flex alignItems="center" gap={3}>
                <Text fontSize={6}>⚠️</Text>
                <Box flex="1">
                  <Heading as="h3" variant="subhead" style={{ color: '#d97706', marginBottom: '8px' }}>
                    Demo Mode: Placeholder Products
                  </Heading>
                  <Text style={{ color: '#92400e', marginBottom: '12px' }}>
                    These are sample products for demonstration. To enable real purchases, connect your ThriveCart account.
                  </Text>
                  <Flex gap={3} alignItems="center">
                    <Button 
                      as="a"
                      href="/thrivecart-setup"
                      variant="primary"
                      size="small"
                      style={{ 
                        backgroundColor: '#f59e0b', 
                        color: 'white',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px'
                      }}
                    >
                      Setup Guide →
                    </Button>
                    <Text fontSize={1} style={{ color: '#92400e' }}>
                      Step-by-step instructions to connect real products
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          )}
          
          <Flex gap={5} flexDirection={["column", "column", "row"]}>
            {/* Sidebar Filters */}
            <Box width={["100%", "100%", "25%"]}>
              <ProductFilters 
                filters={filters} 
                activeFilters={activeFilters} 
                setActiveFilters={setActiveFilters}
              />
              
              {/* Store Stats */}
              <Box marginTop={4} padding={4} backgroundColor="white" borderRadius={3} boxShadow="medium">
                <Subhead marginBottom={3} style={{ color: '#111827' }}>Store Stats</Subhead>
                <Box marginBottom={3}>
                  <Text fontSize={3} fontWeight="bold" style={{ color: '#3b82f6' }}>{allProducts.length}</Text>
                  <Text fontSize={2} style={{ color: '#6b7280' }}>Total Products</Text>
                </Box>
                <Box marginBottom={3}>
                  <Text fontSize={3} fontWeight="bold" style={{ color: '#059669' }}>
                    {formatPrice(allProducts.reduce((sum, p) => sum + p.price, 0) / allProducts.length)}
                  </Text>
                  <Text fontSize={2} style={{ color: '#6b7280' }}>Average Price</Text>
                </Box>
                <Box>
                  <Text fontSize={3} fontWeight="bold">⚡</Text>
                  <Text fontSize={2} style={{ color: '#6b7280' }}>Instant Download</Text>
                </Box>
              </Box>
            </Box>
            
            {/* Product Grid */}
            <Box width={["100%", "100%", "75%"]}>
              {filteredProducts.length > 0 ? (
                <>
                  <Box marginBottom={4}>
                    <Text fontSize={2} style={{ color: '#6b7280' }}>
                      Showing {filteredProducts.length} of {allProducts.length} products
                    </Text>
                  </Box>
                  
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '1.5rem'
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <ThriveCartProductCard key={product.id} product={product} />
                    ))}
                  </Box>
                </>
              ) : (
                <Box padding={5} textAlign="center" backgroundColor="white" borderRadius={3} boxShadow="medium">
                  <Text marginBottom={3} style={{ color: '#374151' }}>No products match the selected filters.</Text>
                  <Button 
                    onClick={() => setActiveFilters({ productType: "", tag: "", category: "" })}
                    variant="secondary"
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Box>
              )}
            </Box>
          </Flex>
          
          {/* Store Information Section */}
          <Box marginTop={6} padding={5} backgroundColor="white" borderRadius={3} boxShadow="medium">
            <Heading as="h2" variant="subheadLarge" textAlign="center" marginBottom={4} style={{ color: '#111827' }}>
              Why Choose J. Eldon Music?
            </Heading>
            
            <Flex gap={4} flexDirection={["column", "column", "row"]}>
              <Box flex="1" textAlign="center">
                <Text fontSize={6} marginBottom={2}>⚡</Text>
                <Text fontWeight="bold" marginBottom={2} style={{ color: '#111827' }}>Instant Download</Text>
                <Text fontSize={2} style={{ color: '#6b7280' }}>
                  All digital products are delivered instantly after purchase
                </Text>
              </Box>
              
              <Box flex="1" textAlign="center">
                <Text fontSize={6} marginBottom={2}>📄</Text>
                <Text fontWeight="bold" marginBottom={2} style={{ color: '#111827' }}>Legal Contracts</Text>
                <Text fontSize={2} style={{ color: '#6b7280' }}>
                  Professional contracts provided with every license purchase
                </Text>
              </Box>
              
              <Box flex="1" textAlign="center">
                <Text fontSize={6} marginBottom={2}>🎧</Text>
                <Text fontWeight="bold" marginBottom={2} style={{ color: '#111827' }}>Studio Quality</Text>
                <Text fontSize={2} style={{ color: '#6b7280' }}>
                  Professional-grade beats mixed and mastered to industry standards
                </Text>
              </Box>
            </Flex>
          </Box>
        </Container>
      </Section>
    </Layout>
  )
}

export const Head = () => (
  <SEOHead 
    title="Shop | J. Eldon Music" 
    description="Shop professional beats, exclusive licenses, and music production courses from J. Eldon Music. Instant download with legal contracts included."
  />
)
