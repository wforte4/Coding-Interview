export const isTestingEnv = () => {
  const devEnvs = ['darwin', 'win32'];
  if (devEnvs.indexOf(process.platform) !== -1) return true;
  return false;
};

export default isTestingEnv;
