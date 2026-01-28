# [Feature Name] - UI States

## Screen: [Screen Name]

### Loading State
- **Trigger:** Initial page load, data refresh
- **Duration:** Until data arrives (typically <2s)
- **UI:** [Skeleton / Spinner / Progressive]
- **Interaction:** [What's interactive during loading]
- **Sample Data:** N/A

### Empty State
- **Trigger:** No data exists for this view
- **Message:** "[Exact copy for empty state]"
- **Illustration:** [Yes/No - if yes, describe]
- **CTA:** "[Button text]" -> [Action]
- **Sample Data:** DATA.json -> dataSets.empty

### Success State (Default)
- **Trigger:** Data loaded successfully
- **UI:** [Normal display]
- **Interaction:** [All features available]
- **Sample Data:** DATA.json -> dataSets.typical

### Error State
- **Trigger:** API failure, network error
- **Message:** "[Exact error copy]"
- **Recovery:** "[Retry button text]" -> [Action]
- **Fallback:** [What to show while errored]

### Partial State
- **Trigger:** Some data loaded, some failed
- **UI:** [How to show partial data]
- **Recovery:** [How to retry failed portions]
- **Sample Data:** Mix of typical and error

### Maximum State
- **Trigger:** User has maximum allowed data
- **UI:** [How pagination/scrolling works]
- **Limits:** [What happens at limit]
- **Sample Data:** DATA.json -> dataSets.maximum

### Edge Cases
- **Long text:** [How to handle overflow]
- **Special characters:** [Unicode support]
- **Large numbers:** [Formatting]
- **Sample Data:** DATA.json -> dataSets.edge

### Permission States

#### Unauthorized
- **Trigger:** User lacks permission to view
- **UI:** [What to show]
- **CTA:** [Request access / Go back]

#### Read-Only
- **Trigger:** User can view but not edit
- **UI:** [How to indicate read-only]
- **Disabled elements:** [List]
