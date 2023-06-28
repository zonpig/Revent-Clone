import {StyleSheet, Dimensions} from 'react-native';
import {theme} from '../../theme';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.themeLight,
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  headerNavRight: {
    flexDirection: 'row',
    gap: 10,
  },
  notificationIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: theme.colors.themeDark,
  },
  profileIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: theme.colors.themeDark,
    color: theme.colors.themeLight,
  },
  viewSelector: {
    paddingHorizontal: 20,
  },
  smallText: {
    fontSize: 16,
  },
  bigText: {
    fontSize: 48,
    lineHeight: 48,
    color: theme.colors.textDark,
  },
  chevronGroup: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chevronIcon: {
    marginTop: 10,
  },
  bigTitleGroup: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'baseline',
  },
  toggleSwitchGroup: {
    flexDirection: 'row',
    padding: 15,
    width: '100%',
    justifyContent: 'center',
  },
  toggleSwitch: {
    width: '70%',
    borderRadius: 50,
    backgroundColor: theme.colors.themeVLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleSwitchOn: {
    width: '45%',
    backgroundColor: theme.colors.themeDark,
    padding: 10,
    margin: 5,
    borderRadius: 40,
  },
  toggleSwitchOff: {
    width: '45%',
    padding: 10,
    margin: 5,
    borderRadius: 40,
  },
  toggleSwitchText: {
    fontSize: 16,
    alignSelf: 'center',
    color: theme.colors.textDark,
  },
  graphHeader: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  graph: {
    paddingHorizontal: 20,
  },
  pieLegend: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  pieLegendBox: color => ({
    height: 18,
    width: 18,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: color || 'white',
  }),
  pieLegendText: {
    color: 'black',
    fontSize: 16,
  },
  quickActionsGroup: {
    padding: 20,
  },
  actionIconGroup: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  actionIcon: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: theme.colors.themeDark,
  },
  iconGroup: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  chart: {
    width: screenWidth - 20,
  },
  noReceiptBox: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  pieChartView: {
    marginBottom: -22,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChartLegendView: {
    width: '70%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  collectReceipt: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    backgroundColor: theme.colors.textLight,
    borderWidth: 1,
    borderColor: theme.colors.themeVDark,
  },
  actions: {
    fontSize: 24,
    lineHeight: 24,
    color: theme.colors.textDark,
  },
});

export default styles;
