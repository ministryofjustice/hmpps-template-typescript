import sys
import json

sev_lookup={
  'high':'error',
  'moderate':'warning',
  'low':'note'
}

def eprint(*args, **kwargs):
  print(*args, file=sys.stderr, **kwargs)

def main():
  if len(sys.argv)<2:
    eprint('Usage: python3 auditjson_to_sarif.py <<input.json>> [-o output.json]')
    sys.exit(1)

  # Default for output file if required
  args=sys.argv
  input_file=args[1]
  output_file=f"{args[1].split('.')[0]}.sarif"
  for each_arg in args:
    if each_arg=='-o' and len(args)>(args.index('-o')+1):
      output_file=args[args.index('-o')+1]

  # Build the file framework
  output_dict={ 
    "version": "2.1.0",
    "$schema": "https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json",
    "runs": [
      {
        "tool": {
            "driver": {
              "fullName": "NPM Audit",
              "name": "npx audit-ci",
              "rules": [],
              "version": "0.0.13"
          }
        },
        "results": [],
        "artifacts": []
      }
    ]
  } 

  # Populate the results
  rules_list=[]
  result_list=[]
  result_dict={}
  try:
    with open(input_file) as f:
      results=json.load(f)
    f.close()
    if 'advisories' not in results:
      eprint("No advisories in this json file - assuming it's OK") 
    else:
      results_dict=results['advisories']
  except:
    eprint("Encountered an error - please check the json file")
    sys.exit(1)

  rule_index=0
  for each_result_key in results_dict.keys():
 
    this_result=results_dict[each_result_key]
    # lookup result severity level
    if this_result['severity'] in sev_lookup:
      level=sev_lookup[this_result['severity']]
    else:
      level='none'

    message=''
    for each_element in this_result.keys():
      message+=f'{each_element}: {this_result[each_element]}\n'
    
    via=this_result['via'][0]

    if not isinstance(via, str): # some vulnerabilities come via others - no sarif for them
      rules_dict={
        "id": via['cwe'][0],
        "name": "LanguageSpecificPackageVulnerability",
        "shortDescription": {
                  "text": via['title']
                },
        "defaultConfiguration": {
        "level": level
        },
        "helpUri": via['url'],
        "properties": {
          "precision": "very-high",
          "security-severity": str(via['cvss']['score']),
          "tags": [
            "vulnerability",
            "security",
            this_result['severity'].upper()
          ]
        }
      }  
      rules_list.append(rules_dict)        

      result_dict={
        'ruleId': via['cwe'][0],
        'ruleIndex': rule_index,
        'level': level,
        'message': {'text': message},
        'locations': [ {
          'physicalLocation': {
            'artifactLocation': {
              'uri': this_result['name']
              }
            }
        } ]
      }

      result_list.append(result_dict)
      rule_index+=1

  output_dict['runs'][0]['tool']['driver']['rules']=rules_list
  output_dict['runs'][0]['results']=result_list

  with open(output_file,'w') as f:
    json.dump(output_dict, f)
  f.close()

if __name__ == '__main__':
  main()
