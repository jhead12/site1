# Fixing missing `Mix` GraphQL type in WordPress

If `allWpMix` or the `Mix` GraphQL type is missing during your Gatsby build, perform the following on the WordPress site (or provide these steps to the site admin):

1. Confirm WPGraphQL plugin is installed and active
   - Go to **Plugins → Installed Plugins** and verify `WPGraphQL` is present and active.

2. Install and enable WPGraphQL for Advanced Custom Fields (if you use ACF)
   - Install `wp-graphql-acf` (or the current recommended integration) and activate it.

3. Ensure the `mix` custom post type is registered with GraphQL enabled
   - When registering CPT (in theme/plugin where `register_post_type` is called), ensure the args include:

```php
'show_in_graphql' => true,
'graphql_single_name' => 'Mix',
'graphql_plural_name' => 'Mixes',
```

   - If using a CPT registration plugin (e.g., CPT UI), edit the post type and enable "Show in GraphQL" and set the GraphQL single/plural names accordingly.

4. Verify ACF field groups are configured with "Show in GraphQL" enabled for the field groups used by `Mix`.

5. Add at least one `Mix` post (a draft is sufficient) and confirm it appears in GraphQL.

6. Test the GraphQL endpoint (replace with your URL):

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"query":"{ __type(name:\"Mix\") { name fields { name } } }"}' \
  https://blog.jeldonmusic.com/graphql | jq
```

- If it returns `null`, the type is not exposed. If it returns a type with `fields`, the type is present.

7. Once the type is exposed, trigger a site rebuild on Netlify.

If you want, I can prepare a short admin-facing pull request text you can paste into an issue for the WordPress maintainer.
