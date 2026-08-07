# Development Environment Requirements

## Purpose

The environment exists to make Python and backend development learnable through real project work. AI can accelerate implementation, but the environment should keep the underlying technology visible enough that each change teaches how the application actually works.

The long-term goal is increasing independence. After repeated use, routine Python, FastAPI, Git, database, Docker, testing and deployment tasks should require less explanation and less AI assistance.

## Core direction

- Python is the primary backend language.
- FastAPI is the primary application template.
- Projects should use a stable architecture so routes, services, database logic, models, schemas, tests and configuration have predictable locations.
- Git and GitHub should provide checkpoints, diffs, branches, commits, pull requests and recovery.
- Projects and experiments should be isolated from one another.
- Secrets and API keys must stay outside source code.
- The default workflow should work locally with open-source tools wherever practical.
- Optional hosted services should have a documented local or self-hosted alternative where one exists.
- AI guardrails should be readable and editable by the user.
- Risky changes should produce a warning or approval step before execution.
- Tests and validation should run before AI reports work as complete.
- Database backup and restore should be part of the normal operating model.
- Deployment should be understandable and repeatable.
- The handbook should explain workflows and concepts, not only provide commands to copy.
- Troubleshooting should cover common failures and recovery.
- One example project should demonstrate the full lifecycle from local development through API, database, tests, Git and deployment.

## Learning behavior

When AI creates or changes something important, the environment should explain the relevant concept in context. Examples include:

- endpoint
- request or response schema
- service or business-logic layer
- database model
- migration
- virtual environment
- dependency
- Docker image
- Docker Compose service
- environment variable
- test
- lint or type check
- Git branch, commit or pull request
- staging deployment
- production deployment
- rollback

The explanation should distinguish AI activity from the underlying tool or framework. For example, AI may write a migration file, while Alembic tracks and applies the migration and PostgreSQL stores the resulting schema.

## AI guardrails

AI should be able to perform routine work inside the current project while higher-risk actions receive stronger controls.

### Routine work

- read approved project files
- create or edit code inside expected folders
- create tests
- run allowlisted development and validation commands
- explain errors and diffs
- prepare Git changes on a working branch

### Review or approval first

- add or upgrade dependencies
- change database schema
- create or modify migrations
- make large architectural changes
- delete important files or data
- alter protected configuration
- deploy staging or production revisions
- use production credentials or provider actions

### Blocked by design

- hardcode secrets
- expose secrets in prompts, logs or browser code
- receive unrestricted access to unrelated projects or the full host machine
- bypass tests or required approval gates
- silently rewrite Git history
- silently deploy production
- run arbitrary destructive commands outside a defined sandbox boundary

## Project isolation

The environment should define exactly what a sandbox means. It should answer:

- whether each project receives its own virtual environment, container or both
- which project directories AI can access
- whether the sandbox has network access
- how external tools are allowlisted
- how a sandbox is created, reset and deleted
- how disposable state is separated from persistent project data
- how an experiment can be abandoned without damaging another project

## Proposed project structure

The final structure can change when the stack is finalized, but responsibilities should remain separated.

```text
example-fastapi-project/
  app/
    main.py
    api/
      routes/
    services/
    models/
    schemas/
    db/
    core/
  tests/
  migrations/
  Dockerfile
  compose.yaml
  .env.example
  pyproject.toml
  README.md
```

## Technical decisions to finalize

### Python and FastAPI

- Python version
- FastAPI version and base setup
- dependency manager
- virtual-environment workflow
- development server
- production ASGI server
- standard folder structure
- configuration model
- package upgrade policy

### Database

- default database
- local PostgreSQL setup
- ORM or database layer
- migration tool
- how much SQL is taught directly
- schema-change approval process
- backup and restore procedures
- Redis policy and initial use cases
- file and object storage path

### Docker and sandboxing

- whether Docker is universal or project-specific
- Docker Compose policy
- exact sandbox implementation
- filesystem boundaries
- network boundaries
- reset and deletion workflow
- safe AI access inside the sandbox

### AI tools

- supported coding tools
- provider independence
- model switching
- MCP servers and adapters
- skill sources and ownership
- filesystem permissions
- shell permissions
- database permissions
- GitHub permissions
- deployment permissions
- destructive-command approvals
- usage limits and runaway-loop protection
- non-AI operation when no model is connected

### Testing and quality

- test framework
- formatter
- linter
- type checker
- dependency or security checks
- local validation command
- staging release checklist
- production release checklist

### Git and GitHub

- beginner-friendly branch strategy
- checkpoint behavior before large AI changes
- commit guidance
- pull-request guidance
- diff review guidance
- recovery after broad file changes
- coordination between code rollback and database rollback

### Deployment

- first recommended hosting target
- one-click deployment implementation
- provider portability
- domain and HTTPS handling
- production secret storage
- log access
- monitoring
- crash restart behavior
- staging and production separation
- rollback workflow
- self-hosting path

### Security

- authentication template strategy
- rate limiting
- CORS
- HTTPS and security headers
- package security updates
- `.env.example` standard
- secret rotation after accidental exposure
- backup access controls
- stronger confirmation for production actions

## Handbook requirements

The handbook should explain both the workflow and the technologies involved. It should include:

- creating a project
- starting the local environment
- understanding the folder structure
- adding a FastAPI endpoint
- adding business logic
- adding a database model
- creating and applying a migration
- writing tests
- reading test failures
- using Git checkpoints
- reviewing AI-generated changes
- using Docker and Compose
- moving from local development to staging
- deploying production
- reading production logs
- rolling back code
- backing up and restoring data
- troubleshooting common failures

### Troubleshooting topics

- server will not start
- dependency conflict
- virtual environment is wrong or missing
- database connection failure
- migration failure
- application cannot reach PostgreSQL
- Docker container exits immediately
- port conflict
- missing environment variable
- AI changed too many files
- test suite fails after a generated change
- staging deployment fails
- production deployment fails
- rollback does not restore expected behavior

## Example project requirement

The environment should include one intentionally small application that demonstrates the full lifecycle. A Projects API is a suitable example:

1. create a FastAPI application
2. create project request and response schemas
3. add create, list and update endpoints
4. add service logic
5. add PostgreSQL
6. create the first migration
7. add automated tests
8. containerize the app and database
9. use Git branches and checkpoints
10. deploy to staging
11. deploy a known production revision
12. inspect health and logs
13. practice code rollback
14. practice database backup and restore

## Acceptance standard

The environment should be considered usable when:

- a new FastAPI project can be created from the standard template
- the folder structure and dependency workflow are documented
- local PostgreSQL can be started, migrated, backed up and restored
- AI instruction and permission files are visible and editable
- risky operations have explicit boundaries
- validation can be run with a documented command path
- staging and production are clearly separated
- secrets remain outside source control
- a bad code change can be recovered with Git
- a bad data or migration change has a documented recovery path
- the example project completes the full lifecycle
- the environment remains understandable without requiring one particular AI provider
- the handbook explains enough that routine work gradually becomes independent
