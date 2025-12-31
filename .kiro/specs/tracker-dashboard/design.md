# Design Document: WAYRU Tracker Dashboard

## Overview

The WAYRU Tracker Dashboard is a real-time monitoring and analytics web application that aggregates data from multiple backend services (Solana blockchain, Tx Tracker Service, Rewards Server, NAS) and presents unified metrics through an interactive, responsive interface. The dashboard enables operators, administrators, and public users to monitor network health, track staking activity, view rewards distribution, and analyze historical trends.

**Key Design Goals:**
- Real-time data synchronization with sub-5-second latency
- Responsive design supporting desktop, tablet, and mobile
- Graceful degradation when data sources are unavailable
- High performance with up to 1,000 concurrent users
- Extensible architecture for adding new metrics and data sources

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Client                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         WAYRU Tracker Dashboard (React/Next.js)      │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Metric Widgets │ Charts │ Filters │ Alerts   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Data Layer (Redux/Context + Cache)            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  WebSocket / HTTP Client                       │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket / REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Gateway  │  │ Tx Tracker   │  │ Rewards      │      │
│  │              │  │ Service      │  │ Server       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ NAS Service  │  │ Solana RPC   │  │ Cache Layer  │      │
│  │              │  │              │  │ (Redis)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Solana       │  │ PostgreSQL   │  │ Time-Series  │      │
│  │ Blockchain   │  │ Database     │  │ DB (InfluxDB)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Real-time Events**: Tx Tracker Service emits blockchain events (stake, unstake, claim) via WebSocket
2. **Periodic Polling**: Dashboard polls backend APIs for metrics not available via events (hotspot status, network uptime)
3. **Caching**: API Gateway caches frequently accessed data in Redis with TTL-based expiration
4. **Client-side State**: Dashboard maintains local cache and state using Redux/Context API
5. **UI Updates**: React components subscribe to state changes and re-render when data updates

## Components and Interfaces

### Frontend Components

#### 1. Dashboard Layout Component
- **Purpose**: Main container managing overall dashboard layout
- **Responsibilities**: 
  - Render metric grid
  - Manage filter state
  - Handle responsive breakpoints
  - Coordinate data fetching

#### 2. Metric Widget Component
- **Purpose**: Reusable component displaying a single metric
- **Props**:
  - `metricId`: Unique identifier for the metric
  - `title`: Display name
  - `value`: Current metric value
  - `unit`: Unit of measurement
  - `trend`: Percentage change from previous period
  - `status`: 'loading' | 'error' | 'success'
  - `onClick`: Handler for drill-down navigation
- **Features**:
  - Real-time value updates
  - Trend indicator (up/down/neutral)
  - Error state display
  - Loading skeleton

#### 3. Chart Component
- **Purpose**: Display historical metric data as time-series chart
- **Props**:
  - `data`: Array of {timestamp, value} objects
  - `timeRange`: '24h' | '7d' | '30d'
  - `onTimeRangeChange`: Handler for range selection
  - `onHover`: Handler for tooltip display
- **Features**:
  - Multiple time range options
  - Responsive sizing
  - Tooltip on hover
  - Zoom/pan capabilities

#### 4. Filter Panel Component
- **Purpose**: Provide filtering controls
- **Props**:
  - `filters`: Current filter state
  - `onFilterChange`: Handler for filter updates
  - `availableFilters`: List of available filter options
- **Features**:
  - Multi-select dropdowns
  - Date range picker
  - Filter presets
  - Clear all filters button

#### 5. Alert Panel Component
- **Purpose**: Display active alerts and notifications
- **Props**:
  - `alerts`: Array of alert objects
  - `onDismiss`: Handler for alert dismissal
- **Features**:
  - Severity-based ordering
  - Dismissible alerts
  - Alert history
  - Sound/visual notifications

#### 6. Detail View Component
- **Purpose**: Display drill-down data for a specific metric
- **Props**:
  - `metricId`: Metric to display details for
  - `filters`: Applied filters
- **Features**:
  - Sortable table
  - Pagination
  - Export button
  - Back navigation

### Backend API Interfaces

#### 1. Metrics API
```
GET /api/metrics/current
Response: {
  hotspots_online: number,
  total_tvl: number,
  active_staking_positions: number,
  daily_rewards_distributed: number,
  network_uptime_percentage: number,
  timestamp: ISO8601
}

GET /api/metrics/historical?metric=tvl&range=7d
Response: {
  data: [{timestamp: ISO8601, value: number}],
  aggregation: 'hourly' | 'daily'
}

GET /api/metrics/drill-down?metric=hotspots&filters=...
Response: {
  data: [{id, name, status, region, operator, ...}],
  total_count: number,
  page: number,
  page_size: number
}
```

#### 2. WebSocket Events API
```
Event: 'metric.updated'
Payload: {
  metric_id: string,
  value: number,
  timestamp: ISO8601,
  previous_value: number
}

Event: 'alert.triggered'
Payload: {
  alert_id: string,
  severity: 'critical' | 'warning' | 'info',
  message: string,
  metric_id: string,
  threshold: number,
  current_value: number
}

Event: 'connection.status'
Payload: {
  status: 'connected' | 'disconnected' | 'reconnecting',
  timestamp: ISO8601
}
```

#### 3. Export API
```
POST /api/export
Request: {
  metric_ids: string[],
  date_range: {start: ISO8601, end: ISO8601},
  format: 'csv' | 'json'
}
Response: {
  download_url: string,
  expires_at: ISO8601
}
```

#### 4. Configuration API
```
GET /api/user/dashboard-config
Response: {
  layout: [{widget_id, position, size}],
  visible_metrics: string[],
  theme: 'light' | 'dark',
  refresh_interval: number
}

POST /api/user/dashboard-config
Request: {layout, visible_metrics, theme, refresh_interval}
Response: {success: boolean}
```

## Data Models

### Metric Model
```typescript
interface Metric {
  id: string;
  name: string;
  description: string;
  unit: string;
  current_value: number;
  previous_value: number;
  trend_percentage: number;
  last_updated: ISO8601;
  status: 'healthy' | 'warning' | 'critical' | 'unavailable';
  data_source: string;
  refresh_interval_seconds: number;
}
```

### Alert Model
```typescript
interface Alert {
  id: string;
  metric_id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  threshold: number;
  current_value: number;
  triggered_at: ISO8601;
  dismissed_at?: ISO8601;
  dismissed_by?: string;
}
```

### HistoricalDataPoint Model
```typescript
interface HistoricalDataPoint {
  metric_id: string;
  timestamp: ISO8601;
  value: number;
  aggregation_type: 'raw' | 'hourly_avg' | 'daily_avg';
}
```

### UserDashboardConfig Model
```typescript
interface UserDashboardConfig {
  user_id: string;
  layout: WidgetLayout[];
  visible_metrics: string[];
  theme: 'light' | 'dark';
  refresh_interval_seconds: number;
  created_at: ISO8601;
  updated_at: ISO8601;
}

interface WidgetLayout {
  widget_id: string;
  position: {x: number, y: number};
  size: {width: number, height: number};
}
```

### Filter Model
```typescript
interface DashboardFilter {
  hotspot_status?: 'online' | 'offline' | 'all';
  region?: string[];
  operator_id?: string[];
  staking_tier?: string[];
  date_range?: {start: ISO8601, end: ISO8601};
}
```

## Error Handling

### Client-side Error Handling
- **Network Errors**: Display "Connection lost" banner, cache last known state, auto-retry with exponential backoff
- **API Errors**: Display error message in affected widget, log to error tracking service
- **Data Parsing Errors**: Display "Data unavailable" state, log error details
- **Authentication Errors**: Redirect to login page, clear cached data

### Backend Error Handling
- **Service Unavailable**: Return 503 with retry-after header, cache previous response if available
- **Invalid Request**: Return 400 with detailed error message
- **Authorization Failure**: Return 403, log security event
- **Database Errors**: Return 500, alert operations team, return cached data if available

### Graceful Degradation
- If one data source is unavailable, display other metrics normally
- Show "Data unavailable" placeholder for affected metrics
- Continue updating metrics from available sources
- Display connection status indicator

## Testing Strategy

### Unit Testing
- Test metric calculation logic (trend percentage, aggregation)
- Test filter application logic
- Test data transformation and formatting
- Test error handling and retry logic
- Test cache invalidation logic

### Property-Based Testing
- **Property 1**: Metric updates preserve data integrity (values are numeric, timestamps are valid)
- **Property 2**: Filter application is idempotent (applying same filter twice = applying once)
- **Property 3**: Historical data aggregation preserves sum (hourly sum = daily sum)
- **Property 4**: Cache round-trip consistency (cached data = source data)
- **Property 5**: Real-time updates maintain monotonic timestamp ordering
- **Property 6**: Export data completeness (exported records = filtered records)

### Integration Testing
- Test WebSocket connection and event handling
- Test API polling and data synchronization
- Test authentication and authorization flows
- Test multi-user concurrent access
- Test error recovery and reconnection

### Performance Testing
- Load test with 1,000 concurrent users
- Measure initial page load time (target: <2s)
- Measure interaction response time (target: <500ms)
- Monitor memory usage over extended sessions
- Test with large historical datasets (30+ days)

### Accessibility Testing
- Keyboard navigation testing
- Screen reader compatibility testing
- Color contrast verification (WCAG AA)
- Responsive design testing across devices

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Core Metrics Always Displayed
*For any* dashboard load with available data sources, the system should display all five core metrics (hotspots online, TVL, active staking positions, daily rewards distributed, network uptime percentage) without omission.
**Validates: Requirements 1.2**

### Property 2: Metric Updates Within Time Window
*For any* metric value change in the source system, the displayed value should update within 5 seconds (or 3 seconds for real-time events).
**Validates: Requirements 1.3, 2.1, 2.2, 2.3**

### Property 3: Responsive Layout Adaptation
*For any* viewport size (mobile, tablet, desktop), the dashboard should render all metric widgets without horizontal scrolling and maintain readability.
**Validates: Requirements 1.4**

### Property 4: Graceful Degradation on Source Failure
*For any* data source unavailability, affected metrics should display error state while unaffected metrics continue displaying current values.
**Validates: Requirements 1.5, 10.1**

### Property 5: Real-time Connection Persistence
*For any* active dashboard session, a persistent connection (WebSocket or polling) should be maintained to receive updates without user intervention.
**Validates: Requirements 2.4**

### Property 6: Automatic Reconnection with Backoff
*For any* connection loss, the system should attempt reconnection with exponential backoff and display connection status to the user.
**Validates: Requirements 2.5, 10.2**

### Property 7: Historical Data Aggregation Correctness
*For any* set of raw data points, aggregating them (hourly average for 7-day view, daily average for 30-day view) should produce mathematically correct results where sum of aggregates equals sum of raw data.
**Validates: Requirements 3.3**

### Property 8: Filter Application Idempotence
*For any* filter configuration, applying the same filter twice should produce identical results as applying it once.
**Validates: Requirements 4.2**

### Property 9: Alert Threshold Triggering
*For any* metric exceeding a configured threshold, an alert should be triggered and displayed in the notification panel with correct severity level.
**Validates: Requirements 5.1, 5.2**

### Property 10: Alert Persistence Across Sessions
*For any* active alert, the alert state should persist across page refreshes and browser sessions until explicitly dismissed.
**Validates: Requirements 5.4**

### Property 11: Alert Severity Ordering
*For any* set of active alerts, they should be displayed in order of severity (critical > warning > info).
**Validates: Requirements 5.5**

### Property 12: Export Data Completeness
*For any* export request, the exported file should contain all data points within the selected range with all required fields (timestamp, metric name, value, unit).
**Validates: Requirements 6.2, 6.3**

### Property 13: Export Performance
*For any* export request with up to 100,000 records, the file should be generated and download initiated within 5 seconds.
**Validates: Requirements 6.4**

### Property 14: Role-Based Data Filtering
*For any* authenticated user, displayed metrics should match their role permissions (operators see only their hotspots, administrators see all data).
**Validates: Requirements 7.2, 7.3, 7.4**

### Property 15: Permission Denial Display
*For any* metric the user lacks permission to view, a permission denied message should be displayed instead of the metric data.
**Validates: Requirements 7.5**

### Property 16: Initial Load Performance
*For any* dashboard load on a standard internet connection, the initial view should render within 2 seconds.
**Validates: Requirements 8.1**

### Property 17: Interaction Response Time
*For any* user interaction (filtering, time range selection), the system should respond within 500 milliseconds.
**Validates: Requirements 8.2**

### Property 18: Concurrent User Scalability
*For any* load test with up to 1,000 concurrent users, the system should maintain response times within acceptable limits (no degradation beyond 20% from baseline).
**Validates: Requirements 8.3**

### Property 19: Memory Efficiency with Large Datasets
*For any* 30-day historical dataset, loading and rendering should not cause memory leaks or performance degradation over time.
**Validates: Requirements 8.4**

### Property 20: Client Memory Consumption
*For any* typical usage pattern, client-side memory consumption should remain below 100MB.
**Validates: Requirements 8.5**

### Property 21: Cache Hit Behavior
*For any* metric request with fresh cached data available, the system should return cached data without making a backend request.
**Validates: Requirements 9.1, 9.2**

### Property 22: Cache Expiration and Refresh
*For any* expired cache entry, the system should automatically refresh from the backend service.
**Validates: Requirements 9.3**

### Property 23: Cache Invalidation on Manual Refresh
*For any* manual dashboard refresh, all cache entries should be invalidated and fresh data fetched from all sources.
**Validates: Requirements 9.4**

### Property 24: Cache LRU Eviction
*For any* cache at capacity, least-recently-used entries should be evicted to maintain memory efficiency.
**Validates: Requirements 9.5**

### Property 25: API Retry Logic
*For any* failed API request, the system should retry up to 3 times with exponential backoff before displaying an error.
**Validates: Requirements 10.2**

### Property 26: Error Handling and Logging
*For any* data parsing error, the system should log the error and display a user-friendly message without crashing.
**Validates: Requirements 10.3**

### Property 27: Offline State Caching
*For any* network connection loss, the system should cache and display the last known state until connectivity is restored.
**Validates: Requirements 10.4**

### Property 28: Reconnection Synchronization
*For any* restored connection, the system should automatically synchronize with the backend and update all metrics to current values.
**Validates: Requirements 10.5**

### Property 29: Layout Preference Persistence
*For any* user dashboard customization (adding/removing/resizing widgets), the layout should persist across sessions.
**Validates: Requirements 11.2, 11.3**

### Property 30: Custom Layout Display
*For any* user with customized dashboard layout, their custom layout should be displayed instead of the default.
**Validates: Requirements 11.4**

### Property 31: Dashboard Reset Functionality
*For any* dashboard reset action, the default layout should be restored and all customizations cleared.
**Validates: Requirements 11.5**

### Property 32: Keyboard Navigation Completeness
*For any* dashboard interaction, full functionality should be available using keyboard navigation without requiring a mouse.
**Validates: Requirements 12.1**

### Property 33: Screen Reader Compatibility
*For any* interactive element, semantic HTML and ARIA labels should be present for screen reader compatibility.
**Validates: Requirements 12.2**

### Property 34: Color Contrast Compliance
*For any* text and UI element, color contrast should meet WCAG AA minimum standards (4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 12.3**

### Property 35: Locale-Aware Formatting
*For any* number or date display, formatting should respect the user's locale and language preferences.
**Validates: Requirements 12.4**

### Property 36: Language Switching Completeness
*For any* language selection, all dashboard text, labels, and messages should display in the selected language.
**Validates: Requirements 12.5**

