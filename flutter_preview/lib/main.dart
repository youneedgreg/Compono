import 'package:flutter/material.dart';

/// Proof-of-concept: render the same field-config shape Compono's React
/// builder produces (type/label/placeholder/required) as native Flutter
/// widgets, instead of generated HTML/JSX. The goal is to show that the
/// component model itself (a list of typed field configs) is not tied to
/// any one rendering target.
void main() => runApp(const ComponoPreviewApp());

class FieldConfig {
  final String type; // 'text' | 'textarea' | 'checkbox' | 'select' | 'button'
  final String label;
  final String? placeholder;
  final bool required;
  final List<String>? options;

  const FieldConfig({
    required this.type,
    required this.label,
    this.placeholder,
    this.required = false,
    this.options,
  });
}

const sampleSchema = <FieldConfig>[
  FieldConfig(type: 'text', label: 'Full name', placeholder: 'Jane Doe', required: true),
  FieldConfig(type: 'textarea', label: 'Message', placeholder: 'Say something...'),
  FieldConfig(type: 'select', label: 'Plan', options: ['Free', 'Pro', 'Enterprise']),
  FieldConfig(type: 'checkbox', label: 'Subscribe to updates'),
  FieldConfig(type: 'button', label: 'Submit'),
];

class ComponoPreviewApp extends StatelessWidget {
  const ComponoPreviewApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Compono Flutter Preview',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo),
      home: const SchemaFormScreen(schema: sampleSchema),
    );
  }
}

class SchemaFormScreen extends StatefulWidget {
  final List<FieldConfig> schema;
  const SchemaFormScreen({super.key, required this.schema});

  @override
  State<SchemaFormScreen> createState() => _SchemaFormScreenState();
}

class _SchemaFormScreenState extends State<SchemaFormScreen> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Compono — Flutter renderer (experimental)')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: widget.schema.map(_buildField).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildField(FieldConfig field) {
    switch (field.type) {
      case 'text':
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: TextFormField(
            decoration: InputDecoration(labelText: field.label, hintText: field.placeholder),
            validator: field.required
                ? (v) => (v == null || v.isEmpty) ? '${field.label} is required' : null
                : null,
          ),
        );
      case 'textarea':
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: TextFormField(
            maxLines: 4,
            decoration: InputDecoration(labelText: field.label, hintText: field.placeholder),
          ),
        );
      case 'select':
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: DropdownButtonFormField<String>(
            decoration: InputDecoration(labelText: field.label),
            items: (field.options ?? [])
                .map((o) => DropdownMenuItem(value: o, child: Text(o)))
                .toList(),
            onChanged: (_) {},
          ),
        );
      case 'checkbox':
        return CheckboxListTile(
          title: Text(field.label),
          value: false,
          onChanged: (_) {},
        );
      case 'button':
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: ElevatedButton(
            onPressed: () => _formKey.currentState?.validate(),
            child: Text(field.label),
          ),
        );
      default:
        return const SizedBox.shrink();
    }
  }
}
