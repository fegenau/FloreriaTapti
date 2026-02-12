function validateRut(rut) {
  if (!rut) return false;
  const rutRegex = /^(\d{1,2}\.\d{3}\.\d{3}-[\dkK])$/;
  if (!rutRegex.test(rut)) {
    return false;
  }
  const [body, dv] = rut.split("-");
  if (!body || !dv) return false;
  const cleanBody = body.replace(/\./g, "");
  let sum = 0;
  let multiplier = 2;
  for (let i = cleanBody.length - 1; i >= 0; i--) {
    sum += parseInt(cleanBody.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDvNumber = 11 - sum % 11;
  let expectedDv = "";
  if (expectedDvNumber === 11) {
    expectedDv = "0";
  } else if (expectedDvNumber === 10) {
    expectedDv = "K";
  } else {
    expectedDv = expectedDvNumber.toString();
  }
  return expectedDv.toUpperCase() === dv.toUpperCase();
}

export { validateRut as v };
