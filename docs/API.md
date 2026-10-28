# Analysis API

`POST /api/analyze` accepts a JSON body containing `familyMembers` and optional `locale` (`en` or `ar`, default `en`). This is an unauthenticated demo endpoint. Use fictional information only.

```json
{
  "locale": "en",
  "familyMembers": [
    {
      "id": "fictional-father",
      "name": "Example Father",
      "relationship": "Father",
      "generation": 1,
      "family_side": "paternal",
      "blood_relative": true,
      "conditions": [
        {
          "id": "fictional-condition",
          "condition_name": "Heart Disease",
          "diagnosis_age": 60
        }
      ]
    }
  ]
}
```

Limits: up to 200 members and 50 conditions per member. Member IDs must be unique. Diagnosis age, when provided, is an integer from 0 to 130. Family side must be `paternal`, `maternal`, `self`, or `unknown`. Generation is an integer from 0 to 8. See `lib/validation.ts` for all field limits.

Success returns `patterns`, `aiExplanation`, `doctorSummary`, and `aiAvailable`. The `aiExplanation` field name is retained for compatibility; when AI is disabled it contains the local template explanation.

```json
{
  "patterns": [],
  "aiExplanation": "No notable family pattern was detected from the information provided.",
  "doctorSummary": "No notable family pattern was detected from the information provided.",
  "aiAvailable": false
}
```

This example has one condition in one relative and no matching configured age rule, so no pattern is returned. It is not a statement about the person's actual health risk.

Malformed JSON or invalid input returns HTTP 400. Invalid field responses include paths and validation messages. No record is saved. The prototype does not enforce a production request-body limit, authentication, or per-user rate limiting.
