# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Version-Based Boilerplate Generation (Issue #7)

#### Backend
- **Version Registry System**: Created `server/config/versions.json` containing comprehensive version information for:
  - Go versions (1.21.13 - 1.24.1)
  - Framework versions (Gin, Echo, Chi)
  - Database drivers (PostgreSQL, MySQL, SQLite, MongoDB)
  - GORM versions
  - Feature libraries (Logrus, Zap, Testify, Viper)

- **Version Service** (`server/services/versionService.js`):
  - Load and manage version registry
  - Validate version compatibility between components
  - Check Go version requirements for frameworks and databases
  - Validate GORM compatibility with database drivers
  - Get recommended versions based on Go version selection
  - Export all available versions for frontend consumption

- **API Endpoints** (`/api/versions`):
  - `GET /api/versions` - Fetch all available versions
  - `GET /api/versions/recommended?goVersion=X.X.X` - Get recommended versions for specific Go version
  - `POST /api/versions/validate` - Validate configuration for version compatibility

- **Enhanced Generation**:
  - Updated `generateController.js` to use version service for default version selection
  - Automatic version compatibility validation before project generation
  - Return detailed error messages for incompatible version combinations

- **Dynamic Templates**:
  - Updated `go.mod.ejs` template to use dynamic versions instead of hardcoded values
  - Support for version variables in all dependency declarations

- **Enhanced Validation**:
  - Extended `projectConfigValidator.js` to accept version parameters:
    - `frameworkVersion`, `databaseVersion`, `gormVersion`
    - Feature-specific versions: `logrusVersion`, `zapVersion`, `testifyVersion`, `viperVersion`

#### Frontend
- **Enhanced Store** (`useConfigStore.ts`):
  - Added version state fields for all components
  - Added `fetchVersions()` action to load versions from API
  - Automatic version selection when changing frameworks or databases
  - Version persistence and state management

- **API Service** (`apiService.ts`):
  - Added `getAllVersions()` function to fetch version data
  - Added `validateProjectConfig()` function for client-side validation
  - TypeScript interfaces for version data structures

- **UI Components**:
  - `GoVersionSelector` - Select Go version with release dates
  - `FrameworkVersionSelector` - Dynamic framework version selector
  - Integrated version selectors into main configuration form
  - Display recommended versions and release dates
  - Loading states and error handling

- **Enhanced Configuration**:
  - Version selections automatically passed to backend during generation
  - Real-time compatibility feedback (future enhancement)
  - Maintained backward compatibility with existing configurations

#### Testing
- Created comprehensive test suite for version service (`server/tests/services/versionService.test.js`)
- Tests for version comparison, compatibility validation, and configuration validation

### Technical Details

#### Version Compatibility Rules
1. **Framework-Go Compatibility**: Each framework version specifies minimum required Go version
2. **Database-Go Compatibility**: Database drivers specify minimum Go version requirements
3. **GORM Compatibility**: Database drivers maintain compatibility lists with specific GORM versions
4. **Feature-Go Compatibility**: Feature libraries specify recommended Go versions

#### Migration Path
- Existing projects without version specifications will use default versions
- Version registry can be easily updated by editing `server/config/versions.json`
- No breaking changes to existing API contracts

### Benefits
- **Flexibility**: Users can now select specific versions for all components
- **Compatibility**: Automatic validation prevents incompatible version combinations
- **Up-to-date**: Easy to maintain and update version information
- **Spring Initializer-like Experience**: Similar user experience to Java's Spring Initializer
- **Future-proof**: Foundation for advanced features like real-time compatibility warnings

### Future Enhancements (Phase 2 & 3)
- Real-time compatibility warnings in UI
- Version conflict resolution suggestions
- Automatic dependency updates
- Integration with Go module proxy for latest version detection
