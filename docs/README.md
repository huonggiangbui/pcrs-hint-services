# Main features
- Independently collect data for hint generation, such as problem, submission, hint, and logging with seperate server and database
- Generate automatic hints for PCRS by communicating between PCRS and 3rd-party API
- Perform automatic experiments and A/B testing for hints

# API and Usage
description, params, endpoints, sample response
## Add a question/problem (to provide a hint for)
Endpoint: `/api/problems/:language`
METHOD: `POST`
Query Params:
- `language`: the programming language of the problem

1. Params
**Required**
- `pk`: problem id

**Optional**
- `typeExperiment`: whether the problem experiments between code and text hint type or not
- `crossover`: whether there is a crossover for participants between code and text hint type or not
- `name`: problem name
- `description`: problem description
- `solution`: problem solution
- `starter_code`: problem starter code

# Architecture