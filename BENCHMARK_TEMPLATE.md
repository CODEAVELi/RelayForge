# Benchmark Template (vs incumbent relay)

## Workload
- 200 mixed actions (click/type/snapshot)
- 20 forced disconnect/reconnect cycles
- 3 tab rebind events

## Metrics
1. Action success rate
2. Median action latency (ms)
3. P95 action latency (ms)
4. Duplicate execution count
5. Lost action count
6. Time to recover after disconnect (ms)

## Results table
| Metric | Incumbent | Relay Next | Delta |
|---|---:|---:|---:|
| Success rate |  |  |  |
| Median latency |  |  |  |
| P95 latency |  |  |  |
| Duplicate executions |  |  |  |
| Lost actions |  |  |  |
| Reconnect recovery |  |  |  |

## Notes
- Record browser version and OS
- Record gateway version
- Attach diagnostics JSON export for each run
