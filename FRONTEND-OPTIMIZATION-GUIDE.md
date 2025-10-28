# AI Companies Catalog - Frontend Optimization Guide

## Required Changes

### 1. Add Pagination State
Add these state variables after line 133:
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(20);
```

### 2. Implement Pagination Logic
Add this function after the `applyFilters` function:
```typescript
const getPaginatedCompanies = () => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredCompanies.slice(startIndex, endIndex);
};

const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
```

### 3. Implement List View Component
Add this after the grid view section:
```typescript
{viewMode === 'list' ? (
  <div className="space-y-4">
    {getPaginatedCompanies().map((company) => (
      <Card key={company.id} className="hover:shadow-lg transition-shadow">
        <div className="flex gap-4 p-4">
          <img
            src={company.logo_storage_url || company.logo_url || company.logo_base64}
            alt={company.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{company.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
            <div className="flex gap-2 mt-2">
              {company.industry_tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild size="sm">
              <Link to={`/ai-companies/${company.id}`}>View</Link>
            </Button>
          </div>
        </div>
      </Card>
    ))}
  </div>
) : null}
```

### 4. Add Pagination Controls
Add before the closing div:
```typescript
{/* Pagination */}
{filteredCompanies.length > itemsPerPage && (
  <div className="flex items-center justify-center gap-2 mt-8">
    <Button
      variant="outline"
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <span className="px-4 text-sm">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="outline"
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
)}
```

### 5. Add Tag Click Handler
Add to navigation context:
```typescript
const navigateToTag = (tag: string) => {
  navigate(`/ai-companies?tag=${encodeURIComponent(tag)}`);
};
```

### 6. Mobile Optimizations
- Use responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Hide some details on mobile
- Show abbreviated descriptions on mobile

## Summary
This guide provides code snippets to add pagination, list view, and tag navigation to the AI Companies Catalog page.
