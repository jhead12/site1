#!/bin/bash

# GraphQL Development Monitor Script
# Keeps the GraphQL system running and provides real-time feedback

set -e

echo "🚀 Starting GraphQL Development Monitor"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if development server is running
check_dev_server() {
    if curl -s -f "http://localhost:8000" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to check GraphiQL endpoint
check_graphiql() {
    if curl -s -f "http://localhost:8000/___graphql" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to clean and restart development server
restart_dev_server() {
    echo -e "${YELLOW}🧹 Cleaning Gatsby cache...${NC}"
    gatsby clean
    
    echo -e "${BLUE}🔄 Starting development server...${NC}"
    GATSBY_CONFIG_FILE=gatsby-config-dev.js gatsby develop &
    DEV_PID=$!
    
    echo -e "${BLUE}📊 Development server PID: $DEV_PID${NC}"
    echo $DEV_PID > .dev-server.pid
    
    # Wait for server to start
    echo -e "${BLUE}⏳ Waiting for development server to start...${NC}"
    sleep 10
    
    for i in {1..30}; do
        if check_dev_server; then
            echo -e "${GREEN}✅ Development server is running!${NC}"
            break
        else
            echo -e "${YELLOW}⏳ Still waiting... (attempt $i/30)${NC}"
            sleep 2
        fi
    done
}

# Function to monitor GraphQL schema errors
monitor_schema() {
    echo -e "${BLUE}🔍 Monitoring GraphQL schema...${NC}"
    
    # Check for common schema errors in the logs
    if [ -f ".gatsby-cache/logs/develop.log" ]; then
        echo -e "${BLUE}📋 Recent schema errors:${NC}"
        tail -n 50 .gatsby-cache/logs/develop.log | grep -i "error\|warn" | tail -n 10
    fi
}

# Function to provide GraphQL URLs
show_graphql_urls() {
    echo -e "${GREEN}🌐 GraphQL Development URLs:${NC}"
    echo -e "   📊 GraphiQL Explorer: ${BLUE}http://localhost:8000/___graphql${NC}"
    echo -e "   🏠 Development Site:   ${BLUE}http://localhost:8000${NC}"
    echo -e "   📡 GraphQL Endpoint:   ${BLUE}http://localhost:8000/___graphql${NC}"
}

# Function to run schema inspection
run_schema_inspection() {
    echo -e "${BLUE}🔍 Running schema inspection...${NC}"
    node scripts/inspect-graphql-schema.js
}

# Main monitoring loop
main() {
    echo -e "${BLUE}🔧 Checking current status...${NC}"
    
    if check_dev_server; then
        echo -e "${GREEN}✅ Development server is already running${NC}"
        show_graphql_urls
    else
        echo -e "${YELLOW}⚠️  Development server is not running${NC}"
        restart_dev_server
    fi
    
    if check_graphiql; then
        echo -e "${GREEN}✅ GraphiQL is accessible${NC}"
    else
        echo -e "${RED}❌ GraphiQL is not accessible${NC}"
    fi
    
    # Show URLs
    show_graphql_urls
    
    # Run schema inspection
    echo ""
    run_schema_inspection
    
    echo ""
    echo -e "${GREEN}📝 Tips for GraphQL Development:${NC}"
    echo -e "   1. Use GraphiQL at http://localhost:8000/___graphql to test queries"
    echo -e "   2. Check schema validation with: ${BLUE}node scripts/inspect-graphql-schema.js${NC}"
    echo -e "   3. Monitor logs with: ${BLUE}tail -f .gatsby-cache/logs/develop.log${NC}"
    echo -e "   4. Clean cache if needed: ${BLUE}gatsby clean${NC}"
    echo ""
    echo -e "${YELLOW}🔄 To keep monitoring, run this script again or use: npm run develop:wp${NC}"
}

# Handle cleanup on exit
cleanup() {
    echo -e "${YELLOW}🛑 Cleaning up...${NC}"
    if [ -f ".dev-server.pid" ]; then
        kill $(cat .dev-server.pid) 2>/dev/null || true
        rm .dev-server.pid
    fi
}

trap cleanup EXIT

# Run main function
main

# Optional: Keep monitoring in background
if [ "$1" = "--monitor" ]; then
    echo -e "${BLUE}👁️  Starting continuous monitoring...${NC}"
    while true; do
        sleep 30
        if ! check_dev_server; then
            echo -e "${RED}❌ Development server stopped! Restarting...${NC}"
            restart_dev_server
        fi
    done
fi
