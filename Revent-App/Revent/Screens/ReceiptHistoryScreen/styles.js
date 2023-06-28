import {StyleSheet} from 'react-native';
import {theme} from '../../theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.textLight,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  text: {
    color: theme.colors.textDark,
    fontSize: 32,
    fontWeight: 500,
    textAlign: 'center',
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallerText: {
    fontSize: 20,
    fontWeight: 500,
    color: theme.colors.textMuted,
  },
  moneyText: {
    fontSize: 32,
    fontWeight: 500,
    color: '#0C586F',
  },
  historyListHeader: {
    backgroundColor: theme.colors.themeLight,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 50,
    elevation: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  historyListTitle: {
    fontWeight: 500,
    fontSize: 20,
    color: theme.colors.textDark,
  },
  bottomRowRightChild: {
    marginTop: 5,
    justifyContent: 'center',
  },
  insightsImage: {
    height: 50,
    width: 50,
  },
  content: {
    paddingTop: 10,
    backgroundColor: theme.colors.textLight,
    flex: 1,
  },
  transaction: {
    flex: 1,
    width: '100%',
  },
  dateEntry: {
    marginBottom: 20,
  },
  date: {
    paddingLeft: 20,
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  popupHeaderRow: {
    marginBottom: 10,
  },
  popupHeaderTitle: {
    fontSize: theme.fontSize.l,
    color: theme.colors.textDark,
  },
  popupOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popupOptionText: {
    fontSize: 16,
    color: 'black',
  },
  importButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.themeVDark,
    padding: 5,
    borderRadius: 10,
    backgroundColor: theme.colors.themeVDark,
  },
});

export default styles;
