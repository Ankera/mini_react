
class Schema {
  private descriptor: any;

  constructor(descriptor: any) {
    this.descriptor = descriptor;
  }

  validate = (values: any) => {
    return new Promise(async (resolve, reject) => {
      const errorFields = [];
      for (const name in this.descriptor) {
        const rules = this.descriptor[name];
        const ruleKeys = Object.keys(rules);
        const errors = [];
        const value = values[name];
        for (let i = 0; i < ruleKeys.length; i++) {
          const ruleKey = ruleKeys[i];
          if (ruleKey === 'required' && !value) {
            errors.push(`${name} is required`);
          } else if (ruleKey === 'min' && +value < rules[ruleKey]) {
            errors.push(`${name} 最小 ${rules[ruleKey]} 个字符`);
          } else if (ruleKey === 'max' && +value > rules[ruleKey]) {
            errors.push(`${name} 最大 ${rules[ruleKey]} 个字符`);
          } else if (ruleKey === 'validator') {
            if (typeof rules[ruleKey] === 'function') {
              const res = await rules[ruleKey](rules[ruleKey], value);
              if (res.length > 0) {
                errors.push(`${name} 不符合自定义规则`)
              }
            }
          }
        }

        if (errors.length > 0) {
          errorFields.push({
            name,
            errors
          })
        }
      }
      if (errorFields.length > 0) {
        reject({ errorFields, values });
      } else {
        resolve(values);
      }
    })
  }
}

export default Schema;