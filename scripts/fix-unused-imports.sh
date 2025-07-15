#!/bin/bash

# Script to remove unused graphql imports

# List of files to check
FILES=(
  "./src/components/benefit-list.js"
  "./src/components/product-list.js"
  "./src/components/stat-list.js"
  "./src/components/testimonial-list.js"
)

for file in "${FILES[@]}"
do
  echo "Checking $file..."
  
  # Check if the file contains GraphQL fragment/query definitions
  if grep -q "export const query = graphql" "$file" || grep -q "fragment.*on" "$file"; then
    echo "  Contains GraphQL fragments - keeping import but adding comment"
    # Replace with commented import
    sed -i '' 's/import { graphql } from "gatsby"/import { graphql } from "gatsby" \/\/ Used for fragment definition/' "$file"
  else
    echo "  No GraphQL fragments found - removing unused import"
    # Remove import
    sed -i '' 's/import { graphql } from "gatsby"//g' "$file"
    # Remove empty line if created
    sed -i '' '/^$/d' "$file"
  fi
  
  echo "  Done processing $file"
done

echo "All files processed."
