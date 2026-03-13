# Mech havoc modding JSON schema

This is a repository for JSON schema for [Mech Havoc](https://store.steampowered.com/app/3237920/Mech_Havoc/) modding

## Quickstart

JSON schema is useful for editors to provide validation and autocompletion for modding files. To start using it, just add this key to the top of your `vehicle.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/juh9870/MechHavocSchema/refs/tags/v0.3/schema.json",
  "vehicle": {
    ...
  }
}
```

This will allow your editor to validate the JSON file against the schema and provide autocompletion