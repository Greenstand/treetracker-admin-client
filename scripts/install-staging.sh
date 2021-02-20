export REACT_APP_API_BASE_URL=http://test.treetracker.org/api/admin/
npm run build
cp -Rp build/* /var/www/admin/
